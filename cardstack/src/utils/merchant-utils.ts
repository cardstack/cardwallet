import { Resolver } from 'did-resolver';
import { getResolver } from '@cardstack/did-resolver';
import { Share } from 'react-native';
import { getAddressPreview } from './formatting-utils';
import { Device } from './device';
import { MerchantRevenueEventFragment } from '@cardstack/graphql';
import { MerchantInformation } from '@cardstack/types';

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

export const generateMerchantPaymentUrl = (
  merchantSafeID: string,
  amount: number,
  network = 'sokol',
  currency = 'SPD'
) =>
  `https://wallet.cardstack.com/pay/${network}/${merchantSafeID}?amount=${amount}&currency=${currency}`;

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
