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
import { captureException } from '@sentry/react-native';
import Web3 from 'web3';

import { getSafesInstance } from '@cardstack/models/safes-providers';
import Web3Instance from '@cardstack/models/web3-instance';
import { Navigation } from '@cardstack/navigation';
import { Routes } from '@cardstack/navigation/routes';
import { DepotType, MerchantSafeType, PrepaidCardType } from '@cardstack/types';
import { updateMerchantSafeWithCustomization } from '@cardstack/utils';

import {
  getDepots,
  getMerchantSafes,
  getPrepaidCards,
  saveDepots,
  saveMerchantSafes,
  savePrepaidCards,
} from '@rainbow-me/handlers/localstorage/accountLocal';
import { getNetwork } from '@rainbow-me/handlers/localstorage/globalSettings';
import logger from 'logger';

import { getNativeBalanceFromOracle } from './exchange-rate-service';
import { addPrepaidCardCustomization } from './prepaid-cards/prepaid-card-service';

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

    const { depots, prepaidCards, merchantSafes } = normalizeSafesByType(safes);

    // TODO: Move to prepaid-card utils.
    const expandPrepaidCards = Promise.all(
      prepaidCards.map(async prepaidCard => ({
        // The order matters, first add new property then modify tokens
        // otherwise tokens with prices will be overwritten by old tokens
        ...(await addPrepaidCardCustomization(prepaidCard)),
        ...((await updateSafeWithTokenPrices(
          prepaidCard,
          nativeCurrency
        )) as PrepaidCardType),
      }))
    );

    // TODO: Move to merchant-utils.
    const expandMerchantSafes = Promise.all(
      merchantSafes.map(
        async merchantSafe =>
          ({
            ...(await updateMerchantSafeWithCustomization(merchantSafe)),
            ...(await updateSafeWithTokenPrices(merchantSafe, nativeCurrency)),
            ...{
              revenueBalances: await getRevenuePoolBalances(
                merchantSafe.address,
                nativeCurrency
              ),
            },
          } as MerchantSafeType)
      )
    );

    // TODO: Move to depot-utils.
    const expandDepotSafes = Promise.all(
      depots.map(
        async depot =>
          ({
            ...(await updateSafeWithTokenPrices(depot, nativeCurrency)),
          } as DepotType)
      )
    );

    const [
      prepaidCardsTyped,
      merchantSafesTyped,
      depotsTyped,
    ] = await Promise.all([
      expandPrepaidCards,
      expandMerchantSafes,
      expandDepotSafes,
    ]);

    // Unix timestamp
    const timestamp = Math.ceil(Date.now() / 1000).toString();

    const data = {
      depots: depotsTyped,
      prepaidCards: prepaidCardsTyped,
      merchantSafes: merchantSafesTyped,
      timestamp,
    };

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

    return { data };
  } catch (error) {
    logger.sentry('Fetch GnosisSafes failed', error);

    captureException(error);

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
    Navigation.handleAction(Routes.ERROR_FALLBACK_SCREEN, {}, true);

    logger.sentry('Fetch GnosisSafes failed', error);
    captureException(error);
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
  nativeCurrency: NativeCurrency,
  acceptDust = false
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

  const isAmountDust = !acceptDust && nativeBalance < 0.01;

  const amount = isAmountDust ? 0 : nativeBalance;

  const tokenBalance = isAmountDust ? 0 : balance;

  return {
    ...tokenInfo,
    balance: {
      ...convertRawAmountToBalance(tokenBalance, { symbol, decimals }),
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
