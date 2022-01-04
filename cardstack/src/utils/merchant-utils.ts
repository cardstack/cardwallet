import { Resolver } from 'did-resolver';
import { getResolver } from '@cardstack/did-resolver';
import { Share } from 'react-native';
import {
  convertAmountToNativeDisplay,
  convertRawAmountToBalance,
  MerchantSafe,
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
import { IconName } from '@cardstack/components';
import { getNativeBalanceFromOracle } from '@cardstack/services';
import logger from 'logger';

export const ClaimedStatus = {
  CLAIMED_TEXT: `Claimed from \nAvailable Revenue`,
  DEPOSITED_TEXT: `Deposited into \nAccount`,
};

export enum ClaimStatuses {
  DEPOSITED = 'deposited',
  CLAIMED = 'claimed',
}

export type ClaimStatusTypes = ClaimStatuses;

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

export const updateMerchantSafeWithCustomization = async (
  merchant: MerchantSafe
) => {
  try {
    const merchantInfo = await fetchMerchantInfoFromDID(merchant.infoDID);

    return {
      ...merchant,
      merchantInfo,
    };
  } catch (e) {
    logger.sentry('Error getting merchantCustomization', e);
  }

  return merchant;
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

export async function getMerchantClaimTransactionDetails(
  merchantClaimTransaction: MerchantClaimFragment,
  nativeCurrency = 'USD',
  currencyConversionRates: {
    [key: string]: number;
  },
  address?: string
): Promise<MerchantClaimTypeTxn> {
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

  const gasBalance = await getNativeBalanceFromOracle({
    symbol: merchantClaimTransaction.token.symbol || '',
    balance: gasRawAmount,
    nativeCurrency,
  });

  const grossFormattedValue = convertRawAmountToBalance(grossRawAmount, {
    decimals: 18,
    symbol: merchantClaimTransaction.token.symbol || undefined,
  });

  const gasFormattedValue = convertRawAmountToBalance(gasRawAmount, {
    decimals: 18,
    symbol: merchantClaimTransaction.token.symbol || undefined,
  });

  const gasNative = convertAmountToNativeDisplay(gasBalance, nativeCurrency);

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
    gasNativeFee: gasNative || '',
    netClaimed: netFormattedValue.display || '',
  };
}

export async function getMerchantEarnedTransactionDetails(
  prepaidCardPaymentTransaction: PrepaidCardPaymentFragment,
  nativeCurrency = 'USD',
  nativeBalance: number,
  currencyConversionRates: {
    [key: string]: number;
  },
  symbol: string
): Promise<MerchantEarnedRevenueTransactionTypeTxn> {
  const feeCollectedRaw =
    prepaidCardPaymentTransaction.transaction?.merchantFeePayments[0]
      ?.feeCollected;

  const feeCollectedDai = convertRawAmountToBalance(
    feeCollectedRaw,
    {
      decimals: 18,
      symbol,
    },
    3
  ).display;

  const netValue = await getNativeBalanceFromOracle({
    symbol,
    balance: subtract(
      prepaidCardPaymentTransaction.issuingTokenAmount,
      feeCollectedRaw
    ),
    nativeCurrency,
  });

  const netEarned = convertRawAmountToBalance(
    subtract(prepaidCardPaymentTransaction.issuingTokenAmount, feeCollectedRaw),
    {
      decimals: 18,
      symbol: prepaidCardPaymentTransaction.issuingToken.symbol || undefined,
    }
  );

  return {
    customerSpend: prepaidCardPaymentTransaction.spendAmount,
    customerSpendNative: convertAmountToNativeDisplay(
      nativeBalance,
      nativeCurrency
    ),
    protocolFee: feeCollectedDai,
    revenueCollected: convertRawAmountToBalance(
      prepaidCardPaymentTransaction.issuingTokenAmount,
      {
        decimals: 18,
        symbol: prepaidCardPaymentTransaction.issuingToken.symbol || undefined,
      },
      3
    ).display,
    spendConversionRate: convertSpendForBalanceDisplay(
      '1',
      nativeCurrency,
      currencyConversionRates
    ).nativeBalanceDisplay,
    netEarned,
    netEarnedNativeDisplay: convertAmountToNativeDisplay(
      netValue,
      nativeCurrency
    ),
  };
}

export const getClaimProps = (
  status: ClaimStatusTypes = ClaimStatuses.DEPOSITED
) => {
  const PROPS: {
    [key: string]: {
      text: string;
      sign: string;
      icon: IconName;
    };
  } = {
    claimed: {
      text: ClaimedStatus.CLAIMED_TEXT,
      sign: '-',
      icon: 'arrow-up',
    },
    deposited: {
      text: ClaimedStatus.DEPOSITED_TEXT,
      sign: '+',
      icon: 'arrow-down',
    },
  };

  return PROPS[status];
};
