import { TokenInfo } from '@cardstack/cardpay-sdk';
import { BalanceType } from '.';

// Balance info added with redux
export interface TokenType extends Omit<TokenInfo, 'balance'> {
  native: {
    balance: BalanceType;
  };
  balance: BalanceType;
}
