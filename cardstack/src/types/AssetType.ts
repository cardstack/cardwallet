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

export interface AssetType {
  id: string;
  address: string;
  tokenID?: string;
  name: string;
  symbol: string;
  decimals: number;
  type: AssetTypes;
}

export interface AssetWithNativeType extends AssetType {
  balance?: BalanceType;
  native: {
    balance: BalanceType;
  };
}

export interface AssetWithTokensType extends AssetType {
  tokens: Array<TokenType>;
}
