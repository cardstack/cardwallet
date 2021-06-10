/* THIS WILL BE MOVED TO THE SDK */

import {
  convertAmountToNativeDisplay,
  getConstantByNetwork,
} from '@cardstack/cardpay-sdk';

export const NATIVE_TOKEN_SYMBOLS = ['eth', 'spoa', 'dai', 'keth'];
const MAINNETS = ['mainnet', 'xdai'];
const LAYER_1_NETWORKS = ['mainnet', 'kovan'];

export const isNativeToken = (symbol: string, network: string) => {
  const nativeTokenSymbol = getConstantByNetwork('nativeTokenSymbol', network);

  return symbol === nativeTokenSymbol;
};

export const isLayer1 = (network: string) => LAYER_1_NETWORKS.includes(network);

export const isMainnet = (network: string) => MAINNETS.includes(network);

export const getNativeBalanceFromSpend = (
  spendAmount: number,
  nativeCurrency: string,
  currencyConversionRates: { [key: string]: number }
): number => {
  const usdBalance = spendAmount / 100;

  if (nativeCurrency === 'USD') {
    return usdBalance;
  } else if (
    currencyConversionRates &&
    currencyConversionRates[nativeCurrency]
  ) {
    return usdBalance * currencyConversionRates[nativeCurrency];
  }

  return 0;
};

export const convertSpendForBalanceDisplay = (
  accumulatedSpendValue: string,
  nativeCurrency: string,
  currencyConversionRates: {
    [key: string]: number;
  },
  includeSuffix?: boolean
) => {
  const nativeBalance = getNativeBalanceFromSpend(
    Number(accumulatedSpendValue),
    nativeCurrency,
    currencyConversionRates
  );

  const spendWithCommas = accumulatedSpendValue.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ','
  );

  const nativeBalanceDisplay = convertAmountToNativeDisplay(
    nativeBalance,
    nativeCurrency
  );

  return {
    tokenBalanceDisplay: `§${spendWithCommas}${includeSuffix ? ' SPEND' : ''}`,
    nativeBalanceDisplay,
  };
};
