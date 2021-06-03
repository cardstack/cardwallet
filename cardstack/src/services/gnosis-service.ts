import Web3 from 'web3';
import {
  getSDK,
  DepotSafe,
  MerchantSafe,
  PrepaidCardSafe,
} from '@cardstack/cardpay-sdk';
import { web3ProviderSdk } from '@rainbow-me/handlers/web3';

export const fetchGnosisSafes = async (address: string) => {
  try {
    const web3 = new Web3(web3ProviderSdk as any);
    const safesInstance = await getSDK('Safes', web3);
    const safes = await safesInstance.view(address);

    safes?.forEach(safe => {
      safe?.tokens.forEach(({ balance, token }) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        token.value = Web3.utils.fromWei(balance);
      });
    });

    const { depots, prepaidCards, merchantSafes } = safes.reduce(
      (
        accum: {
          depots: DepotSafe[];
          merchantSafes: MerchantSafe[];
          prepaidCards: PrepaidCardSafe[];
        },
        safe
      ) => {
        if (safe.type === 'prepaid-card') {
          console.log({ safe });

          return {
            ...accum,
            prepaidCards: [...accum.prepaidCards, safe],
          };
        } else if (safe.type === 'depot') {
          return {
            ...accum,
            depots: [...accum.depots, safe],
          };
        } else if (safe.type === 'merchant') {
          return {
            ...accum,
            merchantSafes: [...accum.merchantSafes, safe],
          };
        }

        return accum;
      },
      {
        depots: [],
        merchantSafes: [],
        prepaidCards: [],
      }
    );

    return {
      depots,
      merchantSafes,
      prepaidCards,
    };
  } catch (error) {
    console.log({ error });
  }
};
