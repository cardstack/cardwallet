import {
  convertAmountToNativeDisplay,
  convertRawAmountToBalance,
} from '@cardstack/cardpay-sdk';
import { MerchantEarnedSpendAndRevenueTransactionType } from '../../types/transaction-types';
import { BaseStrategy } from '../base-strategy';
import { getNativeBalance } from '@cardstack/services';
import { TransactionTypes } from '@cardstack/types';
import { convertSpendForBalanceDisplay } from '@cardstack/utils';

export class MerchantEarnedSpendAndRevenueStrategy extends BaseStrategy {
  handlesTransaction(): boolean {
    const { prepaidCardPayments } = this.transaction;

    return Boolean(
      prepaidCardPayments?.[0] &&
        this.merchantSafeAddresses &&
        this.merchantSafeAddresses.includes(
          prepaidCardPayments[0].merchantSafe?.id || ''
        )
    );
  }

  async mapTransaction(): Promise<MerchantEarnedSpendAndRevenueTransactionType | null> {
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

    const spendDisplay = convertSpendForBalanceDisplay(
      prepaidCardPaymentTransaction.spendAmount,
      this.nativeCurrency,
      this.currencyConversionRates,
      true
    );

    return {
      address: prepaidCardPaymentTransaction.merchantSafe?.id || '',
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
      token: {
        address: prepaidCardPaymentTransaction.issuingToken.id,
        symbol: prepaidCardPaymentTransaction.issuingToken.symbol,
        name: prepaidCardPaymentTransaction.issuingToken.name,
      },
      /* 
          we want the earned revenue transaction to show after the prepaid card payment, but since they're the same transaction they have the same timestamp
          so add one ms to make sure it's sorted to come after the payment
      */
      timestamp: Number(prepaidCardPaymentTransaction.timestamp) + 1,
      type: TransactionTypes.MERCHANT_EARNED_SPEND_AND_REVENUE,
      spendBalanceDisplay: spendDisplay.tokenBalanceDisplay,
      nativeBalanceDisplay: spendDisplay.nativeBalanceDisplay,
      transactionHash: this.transaction.id,
      infoDid: prepaidCardPaymentTransaction.merchantSafe?.infoDid || undefined,
    };
  }
}
