import { Asset } from '@cardstack/services/eoa-assets/eoa-assets-types';

import { TokenType } from '.';
export interface DepotType {
  address: string;
  tokens: Array<TokenType>;
  type: 'depot';
  infoDID?: string;
}

export type DepotAsset = Asset & Omit<TokenType, 'tokenAddress' | 'token'>;
