import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json';

import { utils as ethersUtils } from 'ethers';
import { filter, flatMap, keyBy, map, toLower } from 'lodash';

import RAINBOW_TOKEN_LIST_DATA from './rainbow-token-list.json';

import { RainbowToken } from '@rainbow-me/entities';

const tokenList: RainbowToken[] = map(RAINBOW_TOKEN_LIST_DATA.tokens, token => {
  const { address: rawAddress, decimals, name, symbol, extensions } = token;
  const address = toLower(rawAddress);
  return {
    address,
    decimals,
    name,
    symbol,
    uniqueId: address,
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
  uniqueId: 'eth',
};

const daiWithAddress: RainbowToken = {
  ...ethWithAddress,
  address: 'dai',
  name: 'Dai',
  symbol: 'DAI',
  uniqueId: 'dai',
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

const curatedRainbowTokenList: RainbowToken[] = filter(
  tokenListWithEth,
  'isRainbowCurated'
);

const TOKEN_SAFE_LIST: Record<string, string> = keyBy(
  flatMap(curatedRainbowTokenList, ({ name, symbol }) => [name, symbol]),
  id => toLower(id)
);

const PAIR_INTERFACE = new ethersUtils.Interface(IUniswapV2PairABI);
const PAIR_GET_RESERVES_FRAGMENT = PAIR_INTERFACE.getFunction('getReserves');
const PAIR_GET_RESERVES_CALL_DATA: string = PAIR_INTERFACE.encodeFunctionData(
  PAIR_GET_RESERVES_FRAGMENT
);

export {
  PAIR_GET_RESERVES_CALL_DATA,
  PAIR_GET_RESERVES_FRAGMENT,
  PAIR_INTERFACE,
  RAINBOW_TOKEN_LIST,
  TOKEN_SAFE_LIST,
};
