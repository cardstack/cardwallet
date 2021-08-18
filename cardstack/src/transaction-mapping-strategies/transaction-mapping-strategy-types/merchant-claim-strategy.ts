import {
  convertAmountToNativeDisplay,
  convertRawAmountToBalance,
} from '@cardstack/cardpay-sdk';
import { BaseStrategy } from '../base-strategy';
import { MerchantClaimType, TransactionTypes } from '@cardstack/types';
import { getNativeBalance } from '@cardstack/services';

export class MerchantClaimStrategy extends BaseStrategy {
  handlesTransaction(): boolean {
    const { merchantClaims } = this.transaction;

    if (merchantClaims?.[0]) {
      return true;
    }

    return false;
  }

  async mapTransaction(): Promise<MerchantClaimType | null> {
    const merchantClaimTransaction = this.transaction.merchantClaims?.[0];

    if (!merchantClaimTransaction) {
      return null;
    }

    const nativeBalance = await getNativeBalance({
      symbol: merchantClaimTransaction.token.symbol,
      balance: merchantClaimTransaction.amount,
      nativeCurrency: this.nativeCurrency,
      currencyConversionRates: this.currencyConversionRates,
    });

    return {
      address: merchantClaimTransaction.id,
      balance: convertRawAmountToBalance(merchantClaimTransaction.amount, {
        decimals: 18,
        symbol: merchantClaimTransaction.token.symbol || undefined,
      }),
      native: {
        amount: nativeBalance.toString(),
        display: convertAmountToNativeDisplay(
          nativeBalance,
          this.nativeCurrency
        ),
      },
      createdAt: merchantClaimTransaction.timestamp,
      transactionHash: this.transaction.id,
      hideSafeHeader: Boolean(this.merchantSafeAddress),
      token: {
        address: merchantClaimTransaction.token.id,
        symbol: merchantClaimTransaction?.token.symbol,
        name: merchantClaimTransaction?.token.name,
      },
      type: TransactionTypes.MERCHANT_CLAIM,
    };
  }
}
