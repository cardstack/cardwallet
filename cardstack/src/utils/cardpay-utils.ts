/* THIS WILL BE MOVED TO THE SDK */

import { getConstantByNetwork } from '@cardstack/cardpay-sdk';

export const NATIVE_TOKEN_SYMBOLS = ['eth', 'spoa', 'dai'];
const MAINNETS = ['mainnet', 'xdai'];

/* I want to extract this logic to the SDK, as well as some additional */
export const isNativeToken = (symbol: string, network: string) => {
  const nativeTokenSymbol = getConstantByNetwork('nativeCoin', network);

  return symbol === nativeTokenSymbol;
};

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
