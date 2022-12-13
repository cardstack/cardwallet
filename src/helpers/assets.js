import {
  add,
  convertAmountToNativeDisplay,
  getConstantByNetwork,
} from '@cardstack/cardpay-sdk';
import { compact, concat, find, get, reduce } from 'lodash';
import store from '@rainbow-me/redux/store';
import { ETH_ICON_URL } from '@rainbow-me/references';

export const buildAssetUniqueIdentifier = item => {
  const balance = get(item, 'balance.amount', '');
  const nativePrice = get(item, 'native.price.display', '');
  const uniqueId = get(item, 'uniqueId');

  return compact([balance, nativePrice, uniqueId]).join('_');
};

const addNativeTokenPlaceholder = (
  assets,
  includePlaceholder,
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
      isPinned: false,
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

export const getTotalAssetsBalance = assets =>
  reduce(
    assets,
    (acc, asset) => {
      const balance = asset?.native?.balance?.amount ?? 0;
      return add(acc, parseFloat(balance));
    },
    0
  );

export const buildCoinsList = (
  assetsOriginal,
  nativeCurrency,
  includePlaceholder = false
) => {
  const assets = addNativeTokenPlaceholder(
    assetsOriginal,
    includePlaceholder,
    nativeCurrency
  );

  const allAssets = assets.map(asset => ({
    isCoin: true,
    isSmall: false,
    ...asset,
  }));

  const totalBalancesValue = getTotalAssetsBalance(allAssets);

  return { assets: allAssets, totalBalancesValue };
};

export const buildCollectibleName = ({ asset_contract, id, name }) =>
  name || `${asset_contract.name} #${id}`;
