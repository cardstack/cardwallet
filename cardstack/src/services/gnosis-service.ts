import {
  convertAmountToNativeDisplay,
  convertRawAmountToBalance,
  DepotSafe,
  getSDK,
  MerchantSafe,
  PrepaidCardSafe,
} from '@cardstack/cardpay-sdk';
import Web3 from 'web3';
import {
  saveDepots,
  saveMerchantSafes,
  savePrepaidCards,
} from '@rainbow-me/handlers/localstorage/accountLocal';
import { getWeb3ProviderSdk } from '@rainbow-me/handlers/web3';
import { CurrencyConversionRates } from '@cardstack/types';
import { fetchCardCustomizationFromDID } from '@cardstack/utils';
import logger from 'logger';

export const fetchGnosisSafes = async (address: string) => {
  try {
    const web3 = new Web3((await getWeb3ProviderSdk()) as any);
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

    const extendedPrepaidCards = await Promise.all(
      prepaidCards.map(async (prepaidCard: PrepaidCardSafe) => {
        try {
          const cardCustomization = await fetchCardCustomizationFromDID(
            prepaidCard.customizationDID
          );

          return { ...prepaidCard, cardCustomization };
        } catch (e) {
          logger.sentry(
            'Fetch DID failed:',
            e,
            'DID =',
            prepaidCard.customizationDID
          );

          return prepaidCard;
        }
      })
    );

    return {
      depots,
      merchantSafes,
      prepaidCards: extendedPrepaidCards,
    };
  } catch (error) {
    logger.sentry('Fetch GnosisSafes failed', error);
  }
};

export const getTokensWithPrice = async (
  tokens: any[],
  nativeCurrency: string,
  currencyConversionRates: CurrencyConversionRates
) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const web3 = new Web3(await getWeb3ProviderSdk());
  const layerTwoOracle = await getSDK('LayerTwoOracle', web3);

  return Promise.all(
    tokens.map(async tokenItem => {
      const usdBalance = await layerTwoOracle.getUSDPrice(
        tokenItem.token.symbol,
        tokenItem.balance
      );

      const nativeBalance =
        nativeCurrency === 'USD'
          ? usdBalance
          : currencyConversionRates[nativeCurrency] * usdBalance;

      return {
        ...tokenItem,
        balance: convertRawAmountToBalance(tokenItem.balance, tokenItem.token),
        native: {
          balance: {
            amount: nativeBalance,
            display: convertAmountToNativeDisplay(
              nativeBalance,
              nativeCurrency
            ),
          },
        },
      };
    })
  );
};

export const addGnosisTokenPrices = async (
  payload: any,
  network: string,
  accountAddress: string,
  nativeCurrency: string,
  currencyConversionRates: CurrencyConversionRates
) => {
  const { depots, merchantSafes, prepaidCards } = payload;
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const web3 = new Web3(await getWeb3ProviderSdk());

  if (depots.length || merchantSafes.length || prepaidCards.length) {
    const revenuePool = await getSDK('RevenuePool', web3);

    const [
      depotsWithPrice,
      prepaidCardsWithPrice,
      merchantSafesWithPrice,
    ] = await Promise.all([
      await Promise.all(
        depots.map(async (depot: any) => {
          const tokensWithPrice = await getTokensWithPrice(
            depot.tokens,
            nativeCurrency,
            currencyConversionRates
          );

          return {
            ...depot,
            tokens: tokensWithPrice,
          };
        })
      ),
      await Promise.all(
        prepaidCards.map(async (prepaidCard: any) => {
          const tokensWithPrice = await getTokensWithPrice(
            prepaidCard.tokens,
            nativeCurrency,
            currencyConversionRates
          );

          return {
            ...prepaidCard,
            tokens: tokensWithPrice,
          };
        })
      ),
      await Promise.all(
        merchantSafes.map(async (merchantSafe: any) => {
          const revenueBalances = await revenuePool.balances(
            merchantSafe.address
          );

          const [tokensWithPrice, revenueBalancesWithPrice] = await Promise.all(
            [
              getTokensWithPrice(
                merchantSafe.tokens,
                nativeCurrency,
                currencyConversionRates
              ),
              getTokensWithPrice(
                revenueBalances.map(revenueToken => ({
                  ...revenueToken,
                  token: {
                    symbol: revenueToken.tokenSymbol,
                  },
                })),
                nativeCurrency,
                currencyConversionRates
              ),
            ]
          );

          return {
            ...merchantSafe,
            revenueBalances: revenueBalancesWithPrice,
            tokens: tokensWithPrice,
          };
        })
      ),
    ]);

    savePrepaidCards(prepaidCardsWithPrice, accountAddress, network);
    saveDepots(depotsWithPrice, accountAddress, network);
    saveMerchantSafes(merchantSafesWithPrice, accountAddress, network);

    return {
      depots: depotsWithPrice,
      prepaidCards: prepaidCardsWithPrice,
      merchantSafes: merchantSafesWithPrice,
    };
  }

  return {
    depots: [],
    prepaidCards: [],
    merchantSafes: [],
  };
};
