import {
  convertRawAmountToNativeDisplay,
  convertRawAmountToBalance,
} from '@cardstack/cardpay-sdk';
import { BaseStrategy } from '../base-strategy';
import { MerchantWithdrawType, TransactionTypes } from '@cardstack/types';
import { fetchHistoricalPrice } from '@cardstack/services';

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

    const symbol = merchantWithdraw.token.symbol || '';

    const price = await fetchHistoricalPrice(
      symbol,
      merchantWithdraw.timestamp,
      this.nativeCurrency
    );

    return {
      address: merchantWithdraw.merchantSafe?.id || '',
      createdAt: merchantWithdraw.timestamp,
      balance: convertRawAmountToBalance(merchantWithdraw.amount, {
        decimals: 18,
        symbol,
      }),
      type: TransactionTypes.MERCHANT_WITHDRAW,
      hideSafeHeader: Boolean(this.merchantSafeAddress),
      native: convertRawAmountToNativeDisplay(
        merchantWithdraw.amount,
        18,
        price,
        this.nativeCurrency
      ),
      transactionHash: this.transaction.id,
      infoDid: merchantWithdraw.merchantSafe?.infoDid || undefined,
      to: merchantWithdraw.to,
      token: merchantWithdraw.token,
    };
  }
}
