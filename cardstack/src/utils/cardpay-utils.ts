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

export const getUSDFromSpend = (spendAmount: number): number =>
  spendAmount / 100;

export const convertSpendForBalanceDisplay = (
  accumulatedSpendValue: string,
  nativeCurrency: string,
  includeSuffix?: boolean
) => {
  const usdBalance = getUSDFromSpend(Number(accumulatedSpendValue));

  const spendWithCommas = accumulatedSpendValue.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ','
  );

  const nativeBalanceDisplay = convertAmountToNativeDisplay(
    usdBalance,
    nativeCurrency
  );

  return {
    tokenBalanceDisplay: `§${spendWithCommas}${includeSuffix ? ' SPEND' : ''}`,
    nativeBalanceDisplay,
  };
};
