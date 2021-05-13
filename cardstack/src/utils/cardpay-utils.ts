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

const tokenInfo = {
  ETH: {
    address: 'eth',
    coingeckoId: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
  },
  SPOA: {
    address: 'spoa',
    coingeckoId: 'ethereum',
    symbol: 'SPOA',
    name: 'SPOA',
  },
  DAI: {
    address: 'dai',
    coingeckoId: 'dai',
    symbol: 'DAI',
    name: 'xDai',
  },
};

export const getNativeTokenInfoByNetwork = (network: string) => {
  if (network === 'mainnet' || network === 'kovan') {
    return tokenInfo.ETH;
  }

  if (network === 'sokol') {
    return tokenInfo.SPOA;
  }

  if (network === 'xdai') {
    return tokenInfo.DAI;
  }
};

export const isMainnet = (network: string) => MAINNETS.includes(network);
