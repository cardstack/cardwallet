import {
  convertAmountToNativeDisplay,
  convertRawAmountToBalance,
  DepotSafe,
  getSDK,
  MerchantSafe,
  PrepaidCardSafe,
  Safe,
  TokenInfo,
  NativeCurrency,
} from '@cardstack/cardpay-sdk';
import Web3 from 'web3';
import { captureException } from '@sentry/react-native';
import { AnyAction } from '@reduxjs/toolkit';
import { addPrepaidCardCustomization } from './prepaid-cards/prepaid-card-service';
import { getNativeBalanceFromOracle } from './exchange-rate-service';
import {
  getDepots,
  getMerchantSafes,
  getPrepaidCards,
  saveDepots,
  saveMerchantSafes,
  savePrepaidCards,
} from '@rainbow-me/handlers/localstorage/accountLocal';
import logger from 'logger';
import Web3Instance from '@cardstack/models/web3-instance';
import { Navigation } from '@rainbow-me/navigation';
import { MainRoutes } from '@cardstack/navigation/routes';
import { getSafesInstance } from '@cardstack/models/safes-providers';
import { updateMerchantSafeWithCustomization } from '@cardstack/utils';
import { getNetwork } from '@rainbow-me/handlers/localstorage/globalSettings';
import { dataLoadState } from '@rainbow-me/redux/data';
import store from '@rainbow-me/redux/store';

export const getSafeData = async (address: string) => {
  const safesInstance = await getSafesInstance();

  const result = await safesInstance?.viewSafe(address);
  return result?.safe;
};

export const fetchSafes = async (
  accountAddress: string,
  nativeCurrency: NativeCurrency
) => {
  try {
    const safesInstance = await getSafesInstance();

    const safes =
      (await safesInstance?.view(accountAddress, { viewAll: true }))?.safes ||
      [];

    const safesWithTokenPrices = await Promise.all(
      safes?.map(safe => updateSafeWithTokenPrices(safe, nativeCurrency))
    );

    const { depots, prepaidCards, merchantSafes } = normalizeSafesByType(
      (safesWithTokenPrices as unknown) as Safe[]
    );

    const addPrepaidCardsCustomization = Promise.all(
      prepaidCards.map(addPrepaidCardCustomization)
    );

    const addMerchantSafesCustomization = Promise.all(
      merchantSafes.map(updateMerchantSafeWithCustomization)
    );

    const [extendedPrepaidCards, extendedMerchantSafes] = await Promise.all([
      addPrepaidCardsCustomization,
      addMerchantSafesCustomization,
    ]);

    // Unix timestamp
    const timestamp = Math.ceil(Date.now() / 1000).toString();

    const data = {
      depots,
      prepaidCards: extendedPrepaidCards,
      merchantSafes: extendedMerchantSafes,
      timestamp,
    };

    if (extendedMerchantSafes.length) {
      const merchantSafesWithRevenue = await Promise.all(
        extendedMerchantSafes.map(async merchantSafe => ({
          ...merchantSafe,
          revenueBalances: await getRevenuePoolBalances(
            merchantSafe.address,
            nativeCurrency
          ),
        }))
      );

      data.merchantSafes = merchantSafesWithRevenue;
    }

    // TODO: REMOVE
    // Temporally saving on storage to keep old redux state
    // block-start
    const network = await getNetwork();

    const saveCards = savePrepaidCards(
      data.prepaidCards,
      accountAddress,
      network,
      timestamp
    );

    const saveDepts = saveDepots(
      data.depots,
      accountAddress,
      network,
      timestamp
    );

    const saveMerchant = saveMerchantSafes(
      data.merchantSafes,
      accountAddress,
      network,
      timestamp
    );

    await Promise.all([saveCards, saveDepts, saveMerchant]);

    store.dispatch((dataLoadState() as unknown) as AnyAction);
    // block-end

    return { data };
  } catch (error) {
    captureException(error);
    logger.sentry('Fetch GnosisSafes failed', error);

    const errorResponse = {
      error: {
        status: 418,
        data: error,
      },
    };

    // fallback to previous data to avoid safes disappearing
    const localCache = await getSafesPersistedCache(accountAddress);

    return localCache || errorResponse;
  }
};

const getSafesPersistedCache = async (accountAddress: string) => {
  try {
    const network = await getNetwork();

    const [
      { prepaidCards, timestamp },
      { depots },
      { merchantSafes },
    ] = await Promise.all([
      getPrepaidCards(accountAddress, network),
      getDepots(accountAddress, network),
      getMerchantSafes(accountAddress, network),
    ]);

    // Using a single timestamp for now, but as we move to fetch safes individually
    // we should restructure the data to support one for each section
    if (prepaidCards || depots || merchantSafes) {
      return { data: { prepaidCards, depots, merchantSafes, timestamp } };
    }
  } catch (e) {
    logger.sentry('Retrieving local cache failed', e);
  }
};

export const fetchGnosisSafes = async (address: string) => {
  try {
    const safesInstance = await getSafesInstance();

    const safes = (await safesInstance?.view(address))?.safes || [];

    safes?.forEach(safe => {
      safe?.tokens.forEach(({ balance, token }) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        token.value = Web3.utils.fromWei(balance);
      });
    });

    const { depots, prepaidCards, merchantSafes } = normalizeSafesByType(safes);

    const extendedPrepaidCards = await Promise.all(
      prepaidCards.map(addPrepaidCardCustomization)
    );

    return {
      depots,
      merchantSafes,
      prepaidCards: extendedPrepaidCards,
    };
  } catch (error) {
    Navigation.handleAction(MainRoutes.ERROR_FALLBACK_SCREEN, {}, true);
    captureException(error);
    logger.sentry('Fetch GnosisSafes failed', error);
  }
};

// Helpers
const normalizeSafesByType = (safes: Safe[]) =>
  safes.reduce(
    (
      accum: {
        depots: DepotSafe[];
        merchantSafes: MerchantSafe[];
        prepaidCards: PrepaidCardSafe[];
      },
      safe
    ) => {
      switch (safe.type) {
        case 'prepaid-card':
          return {
            ...accum,
            prepaidCards: [...accum.prepaidCards, safe],
          };
        case 'depot':
          return {
            ...accum,
            depots: [...accum.depots, safe],
          };
        case 'merchant':
          return {
            ...accum,
            merchantSafes: [...accum.merchantSafes, safe],
          };
        default:
          return accum;
      }
    },
    {
      depots: [],
      merchantSafes: [],
      prepaidCards: [],
    }
  );

export const updateSafeWithTokenPrices = async (
  safe: Safe,
  nativeCurrency: NativeCurrency
) => {
  const tokensWithPrice = await Promise.all(
    safe?.tokens.map(async tokenInfo =>
      addNativePriceToToken(tokenInfo, nativeCurrency)
    )
  );

  return { ...safe, tokens: tokensWithPrice };
};

export const addNativePriceToToken = async (
  tokenInfo: TokenInfo,
  nativeCurrency: string
) => {
  const {
    balance,
    token: { symbol, decimals },
  } = tokenInfo;

  const nativeBalance = await getNativeBalanceFromOracle({
    nativeCurrency,
    balance,
    symbol,
  });

  const isAmountDust = nativeBalance < 0.01;

  //decimal places formatting for residual crypto values
  const bufferValue = isAmountDust ? 0 : undefined;

  const amount = isAmountDust ? 0 : nativeBalance;

  return {
    ...tokenInfo,
    balance: {
      ...convertRawAmountToBalance(balance, { symbol, decimals }, bufferValue),
      wei: balance,
    },
    native: {
      balance: {
        amount,
        display: convertAmountToNativeDisplay(amount, nativeCurrency),
      },
    },
  };
};

export const getRevenuePoolBalances = async (
  merchantAddress: string,
  nativeCurrency: NativeCurrency
) => {
  const web3 = await Web3Instance.get();

  const revenuePool = await getSDK('RevenuePool', web3);
  const revenueBalances = await revenuePool.balances(merchantAddress);

  const revenueTokensWithPrice = await Promise.all(
    revenueBalances?.map(
      async ({ tokenSymbol: symbol, balance, tokenAddress }) => {
        const tokenWithPrice = await addNativePriceToToken(
          {
            token: { symbol },
            balance,
          } as TokenInfo,
          nativeCurrency
        );

        return { ...tokenWithPrice, tokenAddress };
      }
    )
  );

  return revenueTokensWithPrice;
};

export const getTokensWithPrice = async (
  tokens: TokenInfo[],
  nativeCurrency: string
) =>
  Promise.all(
    tokens.map(async tokenItem => {
      const {
        balance,
        token: { symbol },
      } = tokenItem;

      const nativeBalance = await getNativeBalanceFromOracle({
        nativeCurrency,
        balance,
        symbol,
      });

      const isAmountDust = nativeBalance < 0.01;

      //decimal places formatting for residual crypto values
      const bufferValue = isAmountDust ? 0 : undefined;
      return {
        ...tokenItem,
        balance: {
          ...convertRawAmountToBalance(
            tokenItem.balance,
            tokenItem.token,
            bufferValue
          ),
          wei: tokenItem.balance,
        },
        native: {
          balance: {
            amount: nativeBalance,
            display: convertAmountToNativeDisplay(
              nativeBalance,
              nativeCurrency,
              bufferValue
            ),
          },
        },
      };
    })
  );

export const addGnosisTokenPrices = async (
  payload: any,
  network: string,
  accountAddress: string,
  nativeCurrency: string
) => {
  const { depots, merchantSafes, prepaidCards } = payload;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const web3 = await Web3Instance.get();

  if (depots?.length || merchantSafes?.length || prepaidCards?.length) {
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
            nativeCurrency
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
            nativeCurrency
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
              getTokensWithPrice(merchantSafe.tokens, nativeCurrency),
              getTokensWithPrice(
                revenueBalances.map(
                  revenueToken =>
                    (({
                      ...revenueToken,
                      token: {
                        symbol: revenueToken.tokenSymbol,
                      },
                    } as unknown) as TokenInfo)
                ),
                nativeCurrency
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
