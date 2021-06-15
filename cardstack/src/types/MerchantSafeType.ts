import { TokenType } from '.';

export interface MerchantSafeType {
  address: string;
  addressPrev: string;
  accumulatedSpendValue: string;
  tokens: TokenType[];
  revenueBalances: TokenType[];
  type: string;
}
