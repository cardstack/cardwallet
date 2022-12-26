import { AssetType, TokenType } from '.';
export interface DepotType {
  address: string;
  tokens: Array<TokenType>;
  type: 'depot';
  infoDID?: string;
}

export type DepotAsset = AssetType & Omit<TokenType, 'tokenAddress' | 'token'>;
