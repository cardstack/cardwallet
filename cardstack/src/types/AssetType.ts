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
  asset_code?: string;
  address?: string;
  balance?: BalanceType;
  coingecko_id: string | null;
  decimals: number;
  icon_url: string;
  name: string;
  tokenID?: string;
  price: {
    changed_at: number | null;
    relative_change_24h: number;
    value: number;
  };
  symbol: string;
  type?: AssetTypes;
  uniqueId?: string;
}

export interface AssetWithNativeType extends AssetType {
  native: {
    balance: BalanceType;
    change: string;
    price: {
      amount: number;
      display: string;
    };
  };
}

export interface AssetWithTokensType extends AssetType {
  address: string;
  tokens: Array<TokenType>;
}
