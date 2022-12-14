import { Asset } from '@cardstack/services/eoa-assets/eoa-assets-types';

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
  balance?: BalanceType;
  decimals: number;
  icon_url: string;
  name: string;
  tokenID?: string;
  type: AssetTypes;
  symbol: string;
}

export interface AssetWithNativeType extends Asset {
  balance?: BalanceType;
  native: {
    balance: BalanceType;
  };
}

export interface AssetWithTokensType extends AssetType {
  address: string;
  tokens: Array<TokenType>;
}
