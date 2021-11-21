import {
  convertAmountToNativeDisplay,
  convertRawAmountToBalance,
} from '@cardstack/cardpay-sdk';
import { BaseStrategy } from '../base-strategy';
import { MerchantWithdrawType, TransactionTypes } from '@cardstack/types';
import { getNativeBalanceFromOracle } from '@cardstack/services';

export class MerchantWithdrawStrategy extends BaseStrategy {
  handlesTransaction(): boolean {
    const { merchantWithdraw } = this.transaction;

    if (merchantWithdraw) {
      return true;
    }

    return false;
  }

  async mapTransaction(): Promise<MerchantWithdrawType | null> {
    const merchantWithdraw = this.transaction.merchantWithdraw;

    if (!merchantWithdraw) {
      return null;
    }

    const nativeBalance = await getNativeBalanceFromOracle({
      symbol: merchantWithdraw.token.symbol,
      balance: merchantWithdraw.amount,
      nativeCurrency: this.nativeCurrency,
    });

    return {
      address: merchantWithdraw.merchantSafe?.id || '',
      createdAt: merchantWithdraw.timestamp,
      balance: convertRawAmountToBalance(merchantWithdraw.amount, {
        decimals: 18,
        symbol: merchantWithdraw.token.symbol || undefined,
      }),
      type: TransactionTypes.MERCHANT_WITHDRAW,
      hideSafeHeader: Boolean(this.merchantSafeAddress),
      native: {
        amount: nativeBalance.toString(),
        display: convertAmountToNativeDisplay(
          nativeBalance,
          this.nativeCurrency
        ),
      },
      transactionHash: this.transaction.id,
      infoDid: merchantWithdraw.merchantSafe?.infoDid || undefined,
      to: merchantWithdraw.to,
      token: merchantWithdraw.token,
    };
  }
}
