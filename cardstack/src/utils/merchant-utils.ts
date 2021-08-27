import { Resolver } from 'did-resolver';
import { getResolver } from '@cardstack/did-resolver';
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
): Promise<MerchantInformation> => {
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

  return attributes || {};
};

export const generateMerchantPaymentUrl = (
  merchantSafeID: string,
  amountInSpend: number,
  network = 'sokol'
) => {
  return `https://wallet.cardstack.com/pay/${network}/${merchantSafeID}?amount=${amountInSpend}`;
};
