import {
  add,
  convertAmountToNativeDisplay,
  getConstantByNetwork,
} from '@cardstack/cardpay-sdk';
import {
  compact,
  concat,
  find,
  forEach,
  get,
  isEmpty,
  reduce,
  slice,
} from 'lodash';
import store from '@rainbow-me/redux/store';
import { ETH_ICON_URL } from '@rainbow-me/references';

const COINS_TO_SHOW = 5;

export const buildAssetUniqueIdentifier = item => {
  const balance = get(item, 'balance.amount', '');
  const nativePrice = get(item, 'native.price.display', '');
  const uniqueId = get(item, 'uniqueId');

  return compact([balance, nativePrice, uniqueId]).join('_');
};

const addNativeTokenPlaceholder = (
  assets,
  includePlaceholder,
  pinnedCoins,
  nativeCurrency
) => {
  const network = store.getState().settings.network;
  const nativeTokenAddress = getConstantByNetwork(
    'nativeTokenAddress',
    network
  );
  const nativeTokenSymbol = getConstantByNetwork('nativeTokenSymbol', network);
  const nativeTokenName = getConstantByNetwork('nativeTokenName', network);
  const hasNativeCurrency = !!find(
    assets,
    asset => asset.address === nativeTokenAddress
  );

  const { genericAssets } = store.getState().data;
  if (includePlaceholder && !hasNativeCurrency && assets.length > 0) {
    const { relative_change_24h, value } = genericAssets?.eth?.price || {};

    const zeroToken = {
      address: nativeTokenAddress,
      balance: {
        amount: '0',
        display: `0 ${nativeTokenSymbol}`,
      },
      color: '#29292E',
      decimals: 18,
      icon_url: ETH_ICON_URL,
      isCoin: true,
      isPinned: pinnedCoins.includes(nativeTokenAddress),
      isPlaceholder: true,
      isSmall: false,
      name: nativeTokenName,
      native: {
        balance: {
          amount: '0.00',
          display: convertAmountToNativeDisplay('0.00', nativeCurrency),
        },
        change: relative_change_24h ? `${relative_change_24h.toFixed(2)}%` : '',
        price: {
          amount: value || '0.00',
          display: convertAmountToNativeDisplay(
            value ? value : '0.00',
            nativeCurrency
          ),
        },
      },
      price: value,
      symbol: nativeTokenSymbol,
      type: 'token',
      uniqueId: nativeTokenAddress,
    };

    return concat([zeroToken], assets);
  }
  return assets;
};

const getTotal = assets =>
  reduce(
    assets,
    (acc, asset) => {
      const balance = asset?.native?.balance?.amount ?? 0;
      return add(acc, balance);
    },
    0
  );

export const buildCoinsList = (
  assetsOriginal,
  nativeCurrency,
  isCoinListEdited,
  pinnedCoins,
  hiddenCoins,
  includePlaceholder = false
) => {
  let standardAssets = [],
    pinnedAssets = [],
    smallAssets = [],
    hiddenAssets = [];

  const assets = addNativeTokenPlaceholder(
    assetsOriginal,
    includePlaceholder,
    pinnedCoins,
    nativeCurrency
  );

  // separate into standard, pinned, small balances, hidden assets
  forEach(assets, asset => {
    if (hiddenCoins && hiddenCoins.includes(asset.uniqueId)) {
      hiddenAssets.push({
        isCoin: true,
        isHidden: true,
        isSmall: true,
        ...asset,
      });
    } else if (pinnedCoins.includes(asset.uniqueId)) {
      pinnedAssets.push({
        isCoin: true,
        isPinned: true,
        isSmall: false,
        ...asset,
      });
    } else {
      standardAssets.push({ isCoin: true, isSmall: false, ...asset });
    }
  });

  // decide which assets to show above or below the coin divider
  const nonHidden = concat(pinnedAssets, standardAssets);
  const dividerIndex = Math.max(pinnedAssets.length, COINS_TO_SHOW);

  let assetsAboveDivider = slice(nonHidden, 0, dividerIndex);
  let assetsBelowDivider = [];

  if (isEmpty(assetsAboveDivider)) {
    assetsAboveDivider = slice(smallAssets, 0, COINS_TO_SHOW);
    assetsBelowDivider = slice(smallAssets, COINS_TO_SHOW);
  } else {
    const remainderBelowDivider = slice(nonHidden, dividerIndex);
    assetsBelowDivider = concat(remainderBelowDivider, smallAssets);
  }

  // calculate small balance and overall totals
  const smallBalancesValue = getTotal(assetsBelowDivider);
  const bigBalancesValue = getTotal(assetsAboveDivider);
  const totalBalancesValue = add(bigBalancesValue, smallBalancesValue);

  // include hidden assets if in edit mode
  if (isCoinListEdited) {
    assetsBelowDivider = concat(assetsBelowDivider, hiddenAssets);
  }

  const allAssets = assetsAboveDivider;

  if (assetsBelowDivider.length > 0 || isCoinListEdited) {
    allAssets.push({
      coinDivider: true,
      value: smallBalancesValue,
    });
    allAssets.push({
      assets: assetsBelowDivider,
      smallBalancesContainer: true,
    });
  }

  return { assets: allAssets, totalBalancesValue };
};

export const buildUniqueTokenName = ({ asset_contract, id, name }) =>
  name || `${asset_contract.name} #${id}`;
