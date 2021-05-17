import Web3 from 'web3';
import { Safes, Safe } from '@cardstack/cardpay-sdk';
import { web3ProviderSdk } from '@rainbow-me/handlers/web3';

export const fetchGnosisSafes = async (address: string) => {
  try {
    const web3 = new Web3(web3ProviderSdk as any);
    const safesInstance = new Safes(web3);
    const safes = await safesInstance.view(address);

    safes?.forEach(safe => {
      safe?.tokens.forEach(({ balance, token }) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        token.value = Web3.utils.fromWei(balance);
      });
    });

    const { depots, prepaidCards } = safes.reduce(
      (
        accum: {
          depots: Safe[];
          prepaidCards: Safe[];
        },
        safe
      ) => {
        if (safe.type === 'prepaid-card') {
          return {
            ...accum,
            prepaidCards: [...accum.prepaidCards, safe],
          };
        } else if (safe.type === 'merchant') {
          return {
            ...accum,
            depots: [...accum.depots, safe],
          };
        }

        return accum;
      },
      {
        depots: [],
        prepaidCards: [],
      }
    );

    return {
      depots,
      prepaidCards,
    };
  } catch (error) {
    console.log({ error });
  }
};
