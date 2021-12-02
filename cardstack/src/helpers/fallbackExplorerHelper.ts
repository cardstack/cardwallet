// Creating helper to modify data.

import { convertAmountToNativeDisplay } from '@cardstack/cardpay-sdk';
import { toLower } from 'lodash';
import { isCPXDToken } from '@cardstack/utils/cardpay-utils';

import { AssetType, AssetWithNativeType, BalanceType } from '@cardstack/types';
import { Network } from '@rainbow-me/helpers/networkTypes';
import { getNativeBalanceFromOracle } from '@cardstack/services';
import { toWei } from '@rainbow-me/handlers/web3';
import { getOnchainAssetBalance } from '@rainbow-me/handlers/assets';

interface Prices {
  [key: string]: {
    last_updated_at: number;
    [key: string]: number;
  };
}

interface ChartData {
  [key: string]: number[][];
}

type BalanceObject = { balance: BalanceType };

interface PriceByCoingeckoParams
  extends Omit<ReduceWithPriceChartBaseParams, 'chartData'> {
  coingeckoId: string;
  tokenInfo: Omit<Parameters<typeof getNativeBalanceFromOracle>[0], 'balance'> &
    BalanceObject;
}

interface ReduceWithPriceChartBaseParams {
  prices: Prices;
  formattedNativeCurrency: string;
  chartData: ChartData;
}

type AssetWithBalance = { asset: AssetType & BalanceObject };

interface ReduceAssetsParams extends ReduceWithPriceChartBaseParams {
  assets: AssetWithBalance[];
  network: Network;
  nativeCurrency: string;
  accountAddress: string;
}

export const addPriceByCoingeckoIdOrOracle = async ({
  coingeckoId,
  prices,
  formattedNativeCurrency,
  tokenInfo,
}: PriceByCoingeckoParams) => {
  const { symbol, nativeCurrency = '', balance } = tokenInfo;

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
    balance,
  };

  // No coingeckoId means the prices array won't have any pricing info
  // So we check the oracle to get the prices
  if (symbol && (isCPXDToken(symbol) || !coingeckoId)) {
    try {
      const priceUnit = await getNativeBalanceFromOracle({
        ...tokenInfo,
        balance: toWei('1'),
      });

      price = {
        ...price,
        value: priceUnit,
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

export const reduceAssetsWithPriceChartAndBalances = async ({
  assets,
  prices,
  formattedNativeCurrency,
  chartData,
  network,
  nativeCurrency = '',
  accountAddress,
}: ReduceAssetsParams) =>
  assets.reduce(async (updatedAssets, { asset }) => {
    const coingeckoId = asset.coingecko_id || '';

    const balance = await getOnchainAssetBalance(
      { address: asset.asset_code || '', ...asset },
      accountAddress,
      network
    );

    const { price, native } = await addPriceByCoingeckoIdOrOracle({
      coingeckoId,
      prices,
      formattedNativeCurrency,
      tokenInfo: {
        symbol: asset.symbol,
        balance,
        nativeCurrency,
      },
    });

    const chartPrices = addChartPriceByCoingeckoId(coingeckoId, chartData);

    return [
      ...(await updatedAssets),
      {
        asset: {
          ...asset,
          price,
          chartPrices,
          native,
          balance,
        },
      },
    ];
  }, Promise.resolve([] as AssetWithBalance[]));
