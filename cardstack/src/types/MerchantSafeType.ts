import { TokenType } from '.';

export interface MerchantSafeType {
  address: string;
  accumulatedSpendValue: string;
  tokens: TokenType[];
  type: string;
}
