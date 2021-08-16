import { TokenInfo } from '@cardstack/cardpay-sdk';
import { AssetWithNativeType } from './AssetType';
import { BalanceType } from '.';

// Balance info added with redux
export interface TokenType extends Omit<TokenInfo, 'balance'> {
  native: {
    balance: BalanceType;
    price: AssetWithNativeType['price'];
  };
  balance: BalanceType;
}
