import { get, groupBy, isEmpty, isNil, map, toNumber } from 'lodash';
import { createSelector } from 'reselect';
import { sortList } from '@cardstack/helpers/sortList';
import { parseAssetsNativeWithTotals } from '@rainbow-me/parsers';

const EMPTY_ARRAY = [];

const assetPricesFromUniswapSelector = state =>
  state.data.assetPricesFromUniswap;
const assetsSelector = state => state.data.assets;
const isLoadingAssetsSelector = state => state.data.isLoadingAssets;
const nativeCurrencySelector = state => state.settings.nativeCurrency;

const sortAssetsByNativeAmount = (
  originalAssets,
  assetPricesFromUniswap,
  isLoadingAssets,
  nativeCurrency
) => {
  let updatedAssets = originalAssets;
  if (!isEmpty(assetPricesFromUniswap)) {
    updatedAssets = map(originalAssets, asset => {
      if (isNil(asset.price)) {
        const assetPrice = get(
          assetPricesFromUniswap,
          `[${asset.address}].price`
        );
        const relativePriceChange = get(
          assetPricesFromUniswap,
          `[${asset.address}].relativePriceChange`
        );
        if (assetPrice) {
          return {
            ...asset,
            price: {
              relative_change_24h: relativePriceChange,
              value: assetPrice,
            },
          };
        }
      }
      return asset;
    });
  }
  let assetsNativePrices = updatedAssets;
  let total = null;
  if (!isEmpty(assetsNativePrices)) {
    const parsedAssets = parseAssetsNativeWithTotals(
      assetsNativePrices,
      nativeCurrency
    );
    assetsNativePrices = parsedAssets.assetsNativePrices;
    total = parsedAssets.total;
  }
  const {
    hasValue = EMPTY_ARRAY,
    noValue = EMPTY_ARRAY,
  } = groupAssetsByMarketValue(assetsNativePrices);

  const sortedAssets = sortList(
    hasValue,
    'native.balance.amount',
    'desc',
    0,
    toNumber
  );
  const sortedShitcoins = sortList(noValue, 'name', 'asc');
  const allAssets = sortedAssets.concat(sortedShitcoins);

  return {
    allAssets,
    allAssetsCount: allAssets.length,
    assetPricesFromUniswap,
    assets: sortedAssets,
    assetsCount: sortedAssets.length,
    assetsTotal: total,
    isBalancesSectionEmpty: isEmpty(allAssets),
    isLoadingAssets,
    nativeCurrency,
    shitcoins: sortedShitcoins,
    shitcoinsCount: sortedShitcoins.length,
  };
};

const groupAssetsByMarketValue = assets =>
  groupBy(assets, ({ native }) => (isNil(native) ? 'noValue' : 'hasValue'));

export const sortAssetsByNativeAmountSelector = createSelector(
  [
    assetsSelector,
    assetPricesFromUniswapSelector,
    isLoadingAssetsSelector,
    nativeCurrencySelector,
  ],
  sortAssetsByNativeAmount
);
