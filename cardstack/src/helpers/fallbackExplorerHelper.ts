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
  AssetWithNativeType,
  BalanceType,
  NetworkType,
} from '@cardstack/types';
import { isCPXDToken, isLayer1 } from '@cardstack/utils/cardpay-utils';

import { Asset } from '@rainbow-me/entities';
import testnetAssets from '@rainbow-me/references/testnet-assets.json';

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
  asset: Asset & { tokenID?: string };
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
  asset,
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
  if (!priceData && isCardPaySupportedNetwork(network) && !asset.tokenID) {
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

type CoingeckoCoins = Array<{
  id: string;
  symbol: string;
  name: string;
  platforms: {
    ethereum?: string;
    'polygon-pos'?: string;
  };
}>;

type HoneySwapTokens = Array<{
  address: string;
  symbol: string;
  name: string;
  chainId: string;
}>;

const HONEYSWAP_ENDPOINT = 'https://tokens.honeyswap.org';

const isValidAddress = (address?: string) =>
  address && toLower(address).substring(0, 2) === '0x';

export const mapTokenAddressToCoingeckoId = async (
  network: NetworkType,
  coingeckoCoins: CoingeckoCoins = []
) => {
  if (network === NetworkType.sokol) {
    return testnetAssets.sokol.reduce(
      // any since it's testnetwork
      (ids: any, { asset: currentAsset }: any) => ({
        ...ids,
        [currentAsset.asset_code]: currentAsset.coingecko_id,
      }),
      {}
    );
  }

  // Coingecko doesn't support gnosis tokenAddresses, so address is fetched from honeySwap
  // and matched by symbol with coingecko coins
  if (isCardPaySupportedNetwork(network)) {
    const honeyswapRequest = await fetch(HONEYSWAP_ENDPOINT);
    const data = await honeyswapRequest.json();
    const honeyswapTokens = data.tokens as HoneySwapTokens;

    return honeyswapTokens.reduce((ids, { address: tokenAddress, symbol }) => {
      const coingeckoToken = coingeckoCoins?.find(
        token => toLower(token.symbol) === toLower(symbol)
      );

      if (!coingeckoToken || !isValidAddress(tokenAddress)) {
        return ids;
      }

      return {
        ...ids,
        [tokenAddress]: coingeckoToken.id,
      };
    }, {});
  }

  // Tokens can have different addresses based on the network, so we need to map based on that
  return coingeckoCoins?.reduce((ids, coinsinfo) => {
    const {
      id,
      symbol,
      platforms: {
        ethereum: ethTokenAddress,
        'polygon-pos': polygonTokenAddress,
      },
    } = coinsinfo;

    const address =
      (isLayer1(network) ? ethTokenAddress : polygonTokenAddress) || '';

    if (!isValidAddress(address)) {
      return ids;
    }

    return {
      ...ids,
      [symbol]: id,
    };
  }, {});
};
