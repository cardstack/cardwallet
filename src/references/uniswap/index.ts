import { keyBy, map, toLower } from 'lodash';

import { RainbowToken } from '@rainbow-me/entities';

import RAINBOW_TOKEN_LIST_DATA from './rainbow-token-list.json';

const tokenList: RainbowToken[] = map(RAINBOW_TOKEN_LIST_DATA.tokens, token => {
  const { address: rawAddress, decimals, name, symbol, extensions } = token;
  const address = toLower(rawAddress);
  return {
    address,
    decimals,
    name,
    symbol,
    id: address,
    ...extensions,
  };
});

const ethWithAddress: RainbowToken = {
  address: 'eth',
  decimals: 18,
  isRainbowCurated: true,
  isVerified: true,
  name: 'Ethereum',
  symbol: 'ETH',
  id: 'eth',
};

const daiWithAddress: RainbowToken = {
  ...ethWithAddress,
  address: 'dai',
  name: 'Dai',
  symbol: 'DAI',
  id: 'dai',
};

const tokenListWithEth: RainbowToken[] = [
  ethWithAddress,
  daiWithAddress,
  ...tokenList,
];

const RAINBOW_TOKEN_LIST: Record<string, RainbowToken> = keyBy(
  tokenListWithEth,
  'address'
);

export { RAINBOW_TOKEN_LIST };
