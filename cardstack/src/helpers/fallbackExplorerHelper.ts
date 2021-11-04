// Creating helper to modify data.

import { convertAmountToNativeDisplay } from '@cardstack/cardpay-sdk';
import { BigNumber } from '@ethersproject/bignumber';
import { toLower } from 'lodash';
import { ETH_ADDRESS } from '@rainbow-me/references/addresses';
import { isNativeToken } from '@cardstack/utils/cardpay-utils';

import {
  AssetType,
  AssetWithNativeType,
  CurrencyConversionRates,
  DepotType,
  PrepaidCardType,
  TokenType,
} from '@cardstack/types';
import { Network } from '@rainbow-me/helpers/networkTypes';
import { getNativeBalanceFromOracle } from '@cardstack/services';

interface Prices {
  [key: string]: {
    last_updated_at: number;
    [key: string]: number;
  };
}

interface ChartData {
  [key: string]: number[][];
}

interface PriceByCoingeckoParams
  extends Omit<ReduceWithPriceChartBaseParams, 'chartData'> {
  coingeckoId: string;
  nativeCurrency: string;
  tokenInfo?: Omit<
    Parameters<typeof getNativeBalanceFromOracle>[0],
    'nativeCurrency'
  >;
}

interface BalanceQuantityParams {
  balances: { [key: string]: string };
  asset: AssetType;
  network: Network;
}

interface ReduceWithPriceChartBaseParams {
  prices: Prices;
  formattedNativeCurrency: string;
  chartData: ChartData;
}

type AssetWithQuantity = { asset: AssetType; quantity: string };

interface ReduceAssetsParams extends ReduceWithPriceChartBaseParams {
  assets: AssetWithQuantity[];
  balances: BalanceQuantityParams['balances'];
  network: Network;
  currencyConversionRates: CurrencyConversionRates;
  nativeCurrency: string;
}

interface TokenWithRBData extends TokenType {
  coingecko_id: string;
  chartPrices: ChartData;
}

type DepotOrPrepaid =
  | Omit<PrepaidCardType, 'tokens'>
  | Omit<DepotType, 'tokens'>;

type DepotsPrepaidToken = DepotOrPrepaid & {
  tokens: TokenWithRBData[];
};

export interface ReduceDepotsParams extends ReduceWithPriceChartBaseParams {
  depots: DepotsPrepaidToken[];
  nativeCurrency?: string;
}

export const addPriceByCoingeckoId = async ({
  coingeckoId,
  prices,
  formattedNativeCurrency,
  nativeCurrency,
  tokenInfo,
}: PriceByCoingeckoParams) => {
  const defaultDisplay = nativeCurrency
    ? convertAmountToNativeDisplay(0, nativeCurrency)
    : '';

  let price: AssetWithNativeType['price'] = {
    changed_at: null,
    relative_change_24h: 0,
    value: 0,
  };

  let native: Omit<AssetWithNativeType['native'], 'change'> = {
    price: {
      amount: 0,
      display: defaultDisplay,
    },
    balance: {
      amount: '0',
      display: defaultDisplay,
    },
  };

  // No coingeckoId means the prices array won't have any pricing info
  // So we check the oracle to get the prices
  if (!coingeckoId && tokenInfo) {
    try {
      const nativeBalance = await getNativeBalanceFromOracle({
        ...tokenInfo,
        nativeCurrency,
      });

      native = {
        ...native,
        balance: {
          amount: nativeBalance.toString(),
          display: convertAmountToNativeDisplay(nativeBalance, nativeCurrency),
        },
      };
    } catch {}
  }

  if (prices) {
    Object.keys(prices).forEach(assetKey => {
      if (toLower(coingeckoId) === toLower(assetKey)) {
        const value = prices[assetKey][`${formattedNativeCurrency}`];
        price = {
          changed_at: prices[assetKey].last_updated_at,
          relative_change_24h:
            prices[assetKey][`${formattedNativeCurrency}_24h_change`],
          value,
        };

        if (nativeCurrency) {
          native = {
            ...native,
            price: {
              amount: value,
              display: convertAmountToNativeDisplay(value, nativeCurrency),
            },
          };
        }
      }
    });
  }

  return { price, native };
};

export const addChartPriceByCoingeckoId = (
  coingeckoId: string,
  chartData: ChartData
) => {
  let chartPrices: ChartData['key'] | null = null;

  if (chartData) {
    Object.keys(chartData).forEach(assetKey => {
      if (toLower(coingeckoId) === toLower(assetKey)) {
        chartPrices = chartData[coingeckoId];
      }
    });
  }

  return chartPrices;
};

export const addQuantityBalance = ({
  balances,
  asset: { symbol, asset_code },
  network,
}: BalanceQuantityParams) => {
  let total = BigNumber.from(0);
  let quantity = '0';

  if (balances) {
    Object.keys(balances).forEach(assetKey => {
      if (
        toLower(asset_code) === toLower(assetKey) ||
        (isNativeToken(symbol, network) && assetKey === ETH_ADDRESS)
      ) {
        quantity = balances[assetKey];
      }

      total = total.add(balances[assetKey]);
    });
  }

  return quantity;
};

export const reduceAssetsWithPriceChartAndBalances = async ({
  assets,
  prices,
  formattedNativeCurrency,
  chartData,
  balances,
  network,
  currencyConversionRates,
  nativeCurrency = '',
}: ReduceAssetsParams) =>
  assets.reduce(async (updatedAssets, { asset }) => {
    const coingeckoId = asset.coingecko_id || '';

    const { price, native } = await addPriceByCoingeckoId({
      coingeckoId,
      prices,
      formattedNativeCurrency,
      nativeCurrency,
      tokenInfo: {
        symbol: asset.symbol,
        balance: asset.asset_code ? balances[asset.asset_code] : '0',
        currencyConversionRates,
      },
    });

    const quantity = addQuantityBalance({ balances, asset, network });

    const chartPrices = addChartPriceByCoingeckoId(coingeckoId, chartData);

    return [
      ...(await updatedAssets),
      { asset: { ...asset, price, chartPrices, native }, quantity },
    ];
  }, Promise.resolve([] as AssetWithQuantity[]));

export const reduceDepotsWithPricesAndChart = async ({
  depots,
  prices,
  formattedNativeCurrency,
  chartData,
  nativeCurrency = '',
}: ReduceDepotsParams) =>
  // Reduce over each depot to return updated tokens
  depots.reduce(async (updatedDepots, depot) => {
    // Add price and chart data to each token of currently depot
    const tokens = await depot.tokens.reduce(async (updatedTokens, token) => {
      const coingeckoId = token.coingecko_id;

      const { price, native } = await addPriceByCoingeckoId({
        coingeckoId,
        prices,
        formattedNativeCurrency,
        nativeCurrency,
      });

      const chartPrices = addChartPriceByCoingeckoId(coingeckoId, chartData);

      return [
        ...(await updatedTokens),
        {
          ...token,
          price,
          // We just want the price, bc the balance is already added on gnosis-service
          native: { ...token.native, price: native.price },
          chartPrices,
        },
      ];
    }, Promise.resolve([] as any));

    return [...(await updatedDepots), { ...depot, tokens }];
  }, Promise.resolve([] as any));
