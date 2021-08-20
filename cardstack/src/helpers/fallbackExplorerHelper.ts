/* eslint-disable @typescript-eslint/camelcase */

// Creating helper to modify data.

import { convertAmountToNativeDisplay } from '@cardstack/cardpay-sdk';
import { BigNumber } from '@ethersproject/bignumber';
import { toLower } from 'lodash';
import { ETH_ADDRESS } from '@rainbow-me/references/addresses';
import { isNativeToken } from '@cardstack/utils/cardpay-utils';

import {
  AssetType,
  AssetWithNativeType,
  DepotType,
  PrepaidCardType,
  TokenType,
} from '@cardstack/types';
import { Network } from '@rainbow-me/helpers/networkTypes';

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
  nativeCurrency?: string;
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

export const addPriceByCoingeckoId = ({
  coingeckoId,
  prices,
  formattedNativeCurrency,
  nativeCurrency,
}: PriceByCoingeckoParams) => {
  let price: AssetWithNativeType['price'] = {
    changed_at: null,
    relative_change_24h: 0,
    value: 0,
  };

  let native: Omit<AssetWithNativeType['native'], 'balance' | 'change'> = {
    price: {
      amount: 0,
      display: nativeCurrency
        ? convertAmountToNativeDisplay(0, nativeCurrency)
        : '',
    },
  };

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

export const reduceAssetsWithPriceChartAndBalances = ({
  assets,
  prices,
  formattedNativeCurrency,
  chartData,
  balances,
  network,
}: ReduceAssetsParams) =>
  assets.reduce((updatedAssets, { asset }) => {
    const coingeckoId = asset.coingecko_id || '';

    const { price } = addPriceByCoingeckoId({
      coingeckoId,
      prices,
      formattedNativeCurrency,
    });

    const chartPrices = addChartPriceByCoingeckoId(coingeckoId, chartData);

    const quantity = addQuantityBalance({ balances, asset, network });

    return [
      ...updatedAssets,
      { asset: { ...asset, price, chartPrices }, quantity },
    ];
  }, [] as AssetWithQuantity[]);

export const reduceDepotsWithPricesAndChart = ({
  depots,
  prices,
  formattedNativeCurrency,
  chartData,
  nativeCurrency,
}: ReduceDepotsParams) =>
  depots.reduce((updatedDepots, depot) => {
    const tokens = depot.tokens.reduce((updatedTokens, token) => {
      const coingeckoId = token.coingecko_id;

      const { price, native } = addPriceByCoingeckoId({
        coingeckoId,
        prices,
        formattedNativeCurrency,
        nativeCurrency,
      });

      const chartPrices = addChartPriceByCoingeckoId(coingeckoId, chartData);

      return [
        ...updatedTokens,
        {
          ...token,
          price,
          native: { ...token.native, ...native },
          chartPrices,
        },
      ];
    }, [] as any);

    return [...updatedDepots, { ...depot, tokens }];
  }, [] as any);
