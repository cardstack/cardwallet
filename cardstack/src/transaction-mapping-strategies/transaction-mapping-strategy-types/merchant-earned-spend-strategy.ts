import {
  convertRawAmountToNativeDisplay,
  convertRawAmountToBalance,
} from '@cardstack/cardpay-sdk';
import { BaseStrategy } from '../base-strategy';
import {
  MerchantEarnedSpendTransactionType,
  TransactionTypes,
} from '@cardstack/types';
import { fetchHistoricalPrice } from '@cardstack/services';
import {
  convertSpendForBalanceDisplay,
  getMerchantEarnedTransactionDetails,
} from '@cardstack/utils';

export class MerchantEarnedSpendStrategy extends BaseStrategy {
  handlesTransaction(): boolean {
    const { prepaidCardPayments } = this.transaction;

    return Boolean(
      prepaidCardPayments?.[0] &&
        this.merchantSafeAddress &&
        prepaidCardPayments[0].merchantSafe?.id === this.merchantSafeAddress
    );
  }

  async mapTransaction(): Promise<MerchantEarnedSpendTransactionType | null> {
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

    const nativeBalance = convertRawAmountToNativeDisplay(
      amount,
      18,
      price,
      this.nativeCurrency
    );

    const { nativeBalanceDisplay } = convertSpendForBalanceDisplay(
      prepaidCardPaymentTransaction.spendAmount,
      this.nativeCurrency,
      this.currencyConversionRates,
      true
    );

    const transactionDetails = await getMerchantEarnedTransactionDetails(
      prepaidCardPaymentTransaction,
      this.nativeCurrency,
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
      timestamp: prepaidCardPaymentTransaction.timestamp,
      type: TransactionTypes.MERCHANT_EARNED_SPEND,
      nativeBalanceDisplay,
      transactionHash: this.transaction.id,
      infoDid: prepaidCardPaymentTransaction.merchantSafe?.infoDid || undefined,
      transaction: transactionDetails,
    };
  }
}
