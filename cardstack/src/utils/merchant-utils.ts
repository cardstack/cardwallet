import { Resolver } from 'did-resolver';
import { getResolver } from '@cardstack/did-resolver';
import { Share } from 'react-native';
import {
  convertAmountToNativeDisplay,
  convertRawAmountToBalance,
  fromWei,
  subtract,
} from '@cardstack/cardpay-sdk';
import { getAddressPreview } from './formatting-utils';
import { Device } from './device';
import {
  MerchantClaimFragment,
  MerchantRevenueEventFragment,
  PrepaidCardPaymentFragment,
} from '@cardstack/graphql';
import {
  MerchantClaimTypeTxn,
  MerchantEarnedRevenueTransactionTypeTxn,
  MerchantInformation,
} from '@cardstack/types';
import { convertSpendForBalanceDisplay } from '@cardstack/utils/cardpay-utils';

export const merchantRevenueEventsToTransactions = (
  revenueEvents: MerchantRevenueEventFragment[]
) => {
  return revenueEvents.map((transaction: any) => {
    const updatedTransaction = {
      ...transaction,
      prepaidCardPayments: [transaction?.prepaidCardPayment],
      merchantClaims: [transaction?.merchantClaim],
    };

    delete updatedTransaction.prepaidCardPayment;
    delete updatedTransaction.merchantClaim;

    return updatedTransaction;
  });
};

export const fetchMerchantInfoFromDID = async (
  merchantInfoDID?: string
): Promise<MerchantInformation | undefined> => {
  if (!merchantInfoDID) {
    throw new Error('merchantInfoDID must be present!');
  }

  const didResolver = new Resolver(getResolver());
  const did = await didResolver.resolve(merchantInfoDID);
  const alsoKnownAs = did?.didDocument?.alsoKnownAs?.[0];

  if (!alsoKnownAs) {
    throw new Error('alsoKnownAs is not defined');
  }

  const {
    data: { attributes },
  } = await (await fetch(alsoKnownAs)).json();

  if (attributes) {
    const { name, slug, color } = attributes;

    return {
      name,
      slug,
      color,
      did: attributes.did,
      textColor: attributes['text-color'],
      ownerAddress: attributes['owner-address'],
    };
  }
};

interface MerchantPaymentURLParams {
  merchantSafeID: string;
  amount?: number;
  network?: string;
  currency?: string;
}

export const generateMerchantPaymentUrl = ({
  merchantSafeID,
  amount,
  network = 'sokol',
  currency = 'SPD',
}: MerchantPaymentURLParams) => {
  const domain = `https://wallet.cardstack.com`;
  const handleAmount = amount ? `amount=${amount}&` : '';

  return `${domain}/pay/${network}/${merchantSafeID}?${handleAmount}currency=${currency}`;
};

export const shareRequestPaymentLink = (
  address: string,
  paymentRequestLink: string
) => {
  // Refer to https://developer.apple.com/documentation/uikit/uiactivitytype
  const activityUiKitPath = 'com.apple.UIKit.activity';

  const excludedActivityTypes = [
    `${activityUiKitPath}.CopyToPasteboard`,
    `${activityUiKitPath}.AddToReadingList`,
  ];

  const options = Device.isIOS
    ? {
        excludedActivityTypes,
      }
    : undefined;

  const obfuscatedAddress = getAddressPreview(address);
  const title = 'Payment Request';
  const message = `${title}\nTo: ${obfuscatedAddress}\nURL: ${paymentRequestLink}`;

  return Share.share(
    {
      message,
      title,
    },
    options
  );
};

export function getMerchantClaimTransactionDetails(
  merchantClaimTransaction: MerchantClaimFragment,
  nativeCurrency = 'USD',
  address?: string
): MerchantClaimTypeTxn {
  const transactions = merchantClaimTransaction.transaction?.tokenTransfers;

  // find the GAS item by address
  const gasData = transactions?.find((item: any) =>
    item?.toTokenHolder?.id?.includes(address)
  );

  const txnData = transactions?.find(
    (item: any) => !item?.toTokenHolder?.id?.includes(address)
  );

  const grossRawAmount = txnData?.amount || '0';
  const gasRawAmount = gasData?.amount || '0';

  const gasFormatted = fromWei(gasRawAmount);

  const grossFormattedValue = convertRawAmountToBalance(grossRawAmount, {
    decimals: 18,
    symbol: merchantClaimTransaction.token.symbol || undefined,
  });

  const gasFormattedValue = convertRawAmountToBalance(gasRawAmount, {
    decimals: 18,
    symbol: merchantClaimTransaction.token.symbol || undefined,
  });

  const gasUSD = convertAmountToNativeDisplay(gasFormatted, nativeCurrency);

  const netFormattedValue = convertRawAmountToBalance(
    subtract(gasRawAmount, grossRawAmount),
    {
      decimals: 18,
      symbol: merchantClaimTransaction.token.symbol || undefined,
    }
  );

  return {
    grossClaimed: grossFormattedValue.display || '',
    gasFee: gasFormattedValue.display || '',
    gasUsdFee: gasUSD || '',
    netClaimed: netFormattedValue.display || '',
  };
}

export function getMerchantEarnedTransactionDetails(
  prepaidCardPaymentTransaction: PrepaidCardPaymentFragment,
  nativeCurrency = 'USD',
  nativeBalance: number,
  currencyConversionRates: {
    [key: string]: number;
  },
  symbol: string
): MerchantEarnedRevenueTransactionTypeTxn {
  const feeCollectedRaw =
    prepaidCardPaymentTransaction.transaction?.merchantFeePayments[0]
      ?.feeCollected;

  const feeCollectedDai = convertRawAmountToBalance(feeCollectedRaw, {
    decimals: 18,
    symbol,
  }).display;

  const feeCollectedUsd = convertAmountToNativeDisplay(
    fromWei(feeCollectedRaw),
    nativeCurrency
  );

  return {
    customerSpend: prepaidCardPaymentTransaction.spendAmount,
    customerSpendUsd: convertAmountToNativeDisplay(
      nativeBalance,
      nativeCurrency
    ),
    protocolFee: feeCollectedDai,
    protocolFeeUsd: feeCollectedUsd,
    spendConversionRate: convertSpendForBalanceDisplay(
      '1',
      nativeCurrency,
      currencyConversionRates
    ).nativeBalanceDisplay,
  };
}
