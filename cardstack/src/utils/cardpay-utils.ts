/* THIS WILL BE MOVED TO THE SDK */

export const NATIVE_TOKEN_SYMBOLS = ['eth', 'spoa'];
const MAINNETS = ['mainnet', 'xdai'];

/* I want to extract this logic to the SDK, as well as some additional helpers */
export const isNativeToken = (assetCode: string) =>
  NATIVE_TOKEN_SYMBOLS.includes(assetCode);

export const getNativeTokenInfoByNetwork = (network: string) => {
  if (network === 'mainnet' || network === 'kovan') {
    return {
      address: 'eth',
      symbol: 'ETH',
      name: 'Ethereum',
    };
  }

  if (network === 'sokol') {
    return {
      address: 'spoa',
      symbol: 'SPOA',
      name: 'SPOA',
    };
  }

  if (network === 'xdai') {
    return {
      address: 'dai',
      symbol: 'DAI',
      name: 'xDai',
    };
  }
};

export const isMainnet = (network: string) => MAINNETS.includes(network);
