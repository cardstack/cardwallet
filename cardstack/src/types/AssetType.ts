import { TokenType } from '.';

export interface BalanceType {
  amount: string;
  display: string;
  wei?: string;
}

export enum AssetTypes {
  compound = 'compound',
  eth = 'eth',
  nft = 'nft',
  token = 'token',
  trash = 'trash',
  uniswap = 'uniswap',
  uniswapV2 = 'uniswap-v2',
}

export interface Asset {
  id: string;
  address: string;
  tokenID?: string;
  name: string;
  symbol: string;
  decimals: number;
  type: AssetTypes;
}

export interface AssetWithNativeType extends Asset {
  balance?: BalanceType;
  native: {
    balance: BalanceType;
  };
}

export interface AssetWithTokensType extends Asset {
  tokens: Array<TokenType>;
}
