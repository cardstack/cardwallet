import {
  convertAmountToNativeDisplay,
  convertRawAmountToBalance,
} from '@cardstack/cardpay-sdk';
import { BaseStrategy } from '../base-strategy';
import {
  MerchantEarnedRevenueTransactionType,
  TransactionTypes,
} from '@cardstack/types';
import { getNativeBalance } from '@cardstack/services';
import { getMerchantEarnedTransactionDetails } from '@cardstack/utils';

export class MerchantEarnedRevenueStrategy extends BaseStrategy {
  handlesTransaction(): boolean {
    const { prepaidCardPayments } = this.transaction;

    return Boolean(
      prepaidCardPayments?.[0] &&
        this.merchantSafeAddress &&
        prepaidCardPayments[0].merchantSafe?.id === this.merchantSafeAddress
    );
  }

  async mapTransaction(): Promise<MerchantEarnedRevenueTransactionType | null> {
    const prepaidCardPaymentTransaction = this.transaction
      .prepaidCardPayments?.[0];

    if (!prepaidCardPaymentTransaction) {
      return null;
    }

    const symbol = prepaidCardPaymentTransaction.issuingToken.symbol || '';
    const amount = prepaidCardPaymentTransaction.issuingTokenAmount;

    const nativeBalance = await getNativeBalance({
      symbol,
      balance: amount,
      nativeCurrency: this.nativeCurrency,
      currencyConversionRates: this.currencyConversionRates,
    });

    return {
      balance: convertRawAmountToBalance(amount, {
        decimals: 18,
        symbol,
      }),
      native: {
        amount: nativeBalance.toString(),
        display: convertAmountToNativeDisplay(
          nativeBalance,
          this.nativeCurrency
        ),
      },
      address: prepaidCardPaymentTransaction.merchantSafe?.id || '',
      token: {
        address: prepaidCardPaymentTransaction.issuingToken.id,
        symbol: prepaidCardPaymentTransaction.issuingToken.symbol,
        name: prepaidCardPaymentTransaction.issuingToken.name,
      },
      timestamp: prepaidCardPaymentTransaction.timestamp,
      type: TransactionTypes.MERCHANT_EARNED_REVENUE,
      transactionHash: this.transaction.id,
      transaction: await getMerchantEarnedTransactionDetails(
        prepaidCardPaymentTransaction,
        this.nativeCurrency,
        nativeBalance,
        this.currencyConversionRates,
        symbol
      ),
      infoDid: prepaidCardPaymentTransaction.merchantSafe?.infoDid || undefined,
    };
  }
}
