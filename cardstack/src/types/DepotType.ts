import { TokenType, AssetType } from '.';
export interface DepotType {
  address: string;
  tokens: Array<TokenType>;
  type: 'depot';
  infoDID?: string;
}

export type DepotAsset = Omit<
  AssetType,
  'coingecko_id' | 'price' | 'icon_url'
> &
  Omit<TokenType, 'tokenAddress' | 'token'>;
