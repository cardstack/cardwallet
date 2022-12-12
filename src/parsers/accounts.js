import {
  add,
  convertAmountToNativeDisplay,
  convertAmountToPercentageDisplay,
} from '@cardstack/cardpay-sdk';
import { get, map, toUpper } from 'lodash';
import { isLowerCaseMatch } from '@rainbow-me/utils';

// eslint-disable-next-line no-useless-escape
const sanitize = s => s.replace(/[^a-z0-9áéíóúñü \.,_@:-]/gim, '');

export const parseAssetName = (metadata, name) => {
  if (metadata?.name) return metadata?.name;
  return name ? sanitize(name) : 'Unknown Token';
};

export const parseAssetSymbol = (metadata, symbol) => {
  if (metadata?.symbol) return metadata?.symbol;
  return symbol ? toUpper(sanitize(symbol)) : '———';
};

export const parseAssetsNativeWithTotals = (assets, nativeCurrency) => {
  const assetsNative = parseAssetsNative(assets, nativeCurrency);
  const totalAmount = assetsNative.reduce(
    (total, asset) => add(total, get(asset, 'native.balance.amount', 0)),
    0
  );
  const totalDisplay = convertAmountToNativeDisplay(
    totalAmount,
    nativeCurrency
  );
  const total = { amount: totalAmount, display: totalDisplay };
  return { assetsNativePrices: assetsNative, total };
};

export const parseAssetsNative = (assets, nativeCurrency) =>
  map(assets, asset => {
    const assetNativePrice = get(asset, 'price', {
      changed_at: null,
      relative_change_24h: 0,
      value: 0,
    });

    return {
      ...asset,
      native: {
        ...asset.native,
        change: isLowerCaseMatch(get(asset, 'symbol'), nativeCurrency)
          ? null
          : assetNativePrice.relative_change_24h
          ? convertAmountToPercentageDisplay(
              assetNativePrice.relative_change_24h
            )
          : '',
      },
    };
  });
