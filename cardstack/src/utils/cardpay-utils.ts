/* THIS WILL BE MOVED TO THE SDK */

import { getConstantByNetwork } from '@cardstack/cardpay-sdk';

export const NATIVE_TOKEN_SYMBOLS = ['eth', 'spoa', 'dai', 'keth'];
const MAINNETS = ['mainnet', 'xdai'];
const LAYER_1_NETWORKS = ['mainnet', 'kovan'];

export const isNativeToken = (symbol: string, network: string) => {
  const nativeTokenSymbol = getConstantByNetwork('nativeTokenSymbol', network);

  return symbol === nativeTokenSymbol;
};

export const isLayer1 = (network: string) => LAYER_1_NETWORKS.includes(network);

export const isMainnet = (network: string) => MAINNETS.includes(network);
