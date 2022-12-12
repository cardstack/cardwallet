// Creating helper to modify data.

import {
  convertAmountAndPriceToNativeDisplay,
  convertAmountToNativeDisplay,
  isCardPaySupportedNetwork,
  NativeCurrency,
} from '@cardstack/cardpay-sdk';
import { toLower } from 'lodash';
import Web3 from 'web3';

import { getNativeBalanceFromOracle } from '@cardstack/services';
import { getOnChainAssetBalance } from '@cardstack/services/assets';
import {
  AssetType,
  AssetTypes,
  AssetWithNativeType,
  BalanceType,
  NetworkType,
} from '@cardstack/types';
import { isCPXDToken } from '@cardstack/utils/cardpay-utils';

import { Asset } from '@rainbow-me/entities';

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
  network: NetworkType;
  nativeCurrency: NativeCurrency;
  accountAddress: string;
}

interface BuildNativeBalanceParams extends BalanceObject {
  nativeCurrency: string;
  priceUnit: number;
}

const buildNativeBalance = ({
  nativeCurrency,
  priceUnit,
  balance,
}: BuildNativeBalanceParams) => ({
  price: {
    amount: priceUnit,
    display: convertAmountToNativeDisplay(priceUnit, nativeCurrency),
  },
  balance: convertAmountAndPriceToNativeDisplay(
    balance.amount,
    priceUnit,
    nativeCurrency
  ),
});

interface GetPriceAndBalanceInfoParams {
  prices: Prices;
  asset: Omit<Asset, 'name'> & { type?: AssetTypes };
  network: NetworkType;
  nativeCurrency: NativeCurrency;
  accountAddress: string;
  coingeckoId?: string;
}

/**
 * Maps coingecko's response to price and balance structures
 * if coingeckoId is provided, it takes preference over contract address
 **/
export const getPriceAndBalanceInfo = async ({
  prices,
  asset: { type, ...asset },
  network,
  coingeckoId,
  nativeCurrency,
  accountAddress,
}: GetPriceAndBalanceInfoParams) => {
  const formattedNativeCurrency = toLower(nativeCurrency);

  // If prices were fetched using id we need to map with id, otherwise we can use contract address
  // Basically native tokens will use coingeckoId
  const priceData = prices?.[coingeckoId || asset.address];

  const balance = await getOnChainAssetBalance({
    asset,
    accountAddress,
    network,
  });

  const price = {
    value: priceData?.[formattedNativeCurrency] || 0,
    changed_at: priceData?.last_updated_at,
    relative_change_24h:
      priceData?.[`${formattedNativeCurrency}_24h_change`] || 0,
  };

  // Custom oracle for .cpxd and other cardpay tokens
  // since coingecko doesn't have it listed
  if (
    !priceData &&
    isCardPaySupportedNetwork(network) &&
    type !== AssetTypes.nft
  ) {
    // only nfts have tokenID and we don't have oracle for that

    const priceUnitFromOracle = await getNativeBalanceFromOracle({
      nativeCurrency,
      symbol: asset.symbol,
      balance: Web3.utils.toWei('1'),
    });

    price.value = priceUnitFromOracle;
  }

  const native = buildNativeBalance({
    nativeCurrency,
    priceUnit: price.value,
    balance,
  });

  return {
    balance,
    native,
    price,
  };
};

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
    balance: {
      amount: '0',
      display: defaultDisplay,
    },
  };

  // No coingeckoId means the prices array won't have any pricing info
  // So we check the oracle to get the prices
  if (symbol && (isCPXDToken(symbol) || !coingeckoId)) {
    try {
      const priceUnit = await getNativeBalanceFromOracle({
        ...tokenInfo,
        balance: Web3.utils.toWei('1'),
      });

      const priceFromOracle = {
        ...price,
        value: priceUnit,
      };

      const nativeBalanceFromOracle = buildNativeBalance({
        priceUnit,
        nativeCurrency,
        balance,
      });

      return { price: priceFromOracle, native: nativeBalanceFromOracle };
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

        native = buildNativeBalance({
          priceUnit: value,
          nativeCurrency,
          balance,
        });
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
  nativeCurrency = NativeCurrency.USD,
  accountAddress,
}: ReduceAssetsParams) =>
  assets.reduce(async (updatedAssets, { asset }) => {
    const coingeckoId = asset.coingecko_id || '';

    const balance = await getOnChainAssetBalance({
      asset: { address: asset.asset_code || '', ...asset },
      accountAddress,
      network,
    });

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
