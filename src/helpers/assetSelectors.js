import { groupBy, isEmpty, isNil, toNumber } from 'lodash';
import { createSelector } from 'reselect';
import { sortList } from '@cardstack/helpers/sortList';
import { parseAssetsNativeWithTotals } from '@rainbow-me/parsers';

const EMPTY_ARRAY = [];

const assetsSelector = state => state.data.assets;
const isLoadingAssetsSelector = state => state.data.isLoadingAssets;
const nativeCurrencySelector = state => state.settings.nativeCurrency;

const sortAssetsByNativeAmount = (
  originalAssets,
  isLoadingAssets,
  nativeCurrency
) => {
  let assetsNativePrices = originalAssets;
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
  [assetsSelector, isLoadingAssetsSelector, nativeCurrencySelector],
  sortAssetsByNativeAmount
);
