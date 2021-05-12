/* THIS WILL BE MOVED TO THE SDK */

export const NATIVE_TOKEN_SYMBOLS = ['eth', 'spoa'];
const MAINNETS = ['mainnet', 'xdai'];

/* I want to extract this logic to the SDK, as well as some additional helpers */
export const isNativeToken = (assetCode: string) =>
  NATIVE_TOKEN_SYMBOLS.includes(assetCode);

const tokenInfo = {
  ETH: {
    address: 'eth',
    symbol: 'ETH',
    name: 'Ethereum',
  },
  SPOA: {
    address: 'spoa',
    symbol: 'SPOA',
    name: 'SPOA',
  },
  DAI: {
    address: 'dai',
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
