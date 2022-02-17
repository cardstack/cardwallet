import {
  convertRawAmountToNativeDisplay,
  convertRawAmountToBalance,
  convertStringToNumber,
} from '@cardstack/cardpay-sdk';
import { MerchantEarnedSpendAndRevenueTransactionType } from '../../types/transaction-types';
import { BaseStrategy } from '../base-strategy';
import { fetchHistoricalPrice } from '@cardstack/services';
import { TransactionTypes } from '@cardstack/types';
import {
  convertSpendForBalanceDisplay,
  getMerchantEarnedTransactionDetails,
} from '@cardstack/utils';

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

    const price = await fetchHistoricalPrice(
      symbol,
      prepaidCardPaymentTransaction.timestamp,
      this.nativeCurrency
    );

    const { nativeBalanceDisplay } = convertSpendForBalanceDisplay(
      prepaidCardPaymentTransaction.spendAmount,
      this.nativeCurrency,
      this.currencyConversionRates
    );

    const nativeBalance = convertRawAmountToNativeDisplay(
      amount,
      18,
      price,
      this.nativeCurrency
    );

    const transactionDetails = await getMerchantEarnedTransactionDetails(
      prepaidCardPaymentTransaction,
      this.nativeCurrency,
      convertStringToNumber(nativeBalance.amount),
      this.currencyConversionRates,
      symbol
    );

    return {
      address: prepaidCardPaymentTransaction.merchantSafe?.id || '',
      fromAddress: prepaidCardPaymentTransaction.prepaidCard.id,
      balance: convertRawAmountToBalance(amount, {
        decimals: 18,
        symbol,
      }),
      netEarned: transactionDetails.netEarned,
      native: nativeBalance,
      token: {
        address: prepaidCardPaymentTransaction.issuingToken.id,
        symbol: prepaidCardPaymentTransaction.issuingToken.symbol,
        name: prepaidCardPaymentTransaction.issuingToken.name,
      },
      transaction: transactionDetails,
      /* 
          we want the earned revenue transaction to show after the prepaid card payment, but since they're the same transaction they have the same timestamp
          so add one ms to make sure it's sorted to come after the payment
      */
      timestamp: Number(prepaidCardPaymentTransaction.timestamp) + 1,
      type: TransactionTypes.MERCHANT_EARNED_SPEND_AND_REVENUE,
      nativeBalanceDisplay,
      transactionHash: this.transaction.id,
      infoDid: prepaidCardPaymentTransaction.merchantSafe?.infoDid || undefined,
    };
  }
}
