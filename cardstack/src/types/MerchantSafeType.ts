import { TokenType } from '.';

export interface MerchantSafeType {
  address: string;
  tokens: TokenType[];
  type: string;
  reloadable: boolean;
}
