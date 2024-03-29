import {
  convertRawAmountToNativeDisplay,
  convertRawAmountToBalance,
} from '@cardstack/cardpay-sdk';

import { fetchHistoricalPrice } from '@cardstack/services';
import {
  MerchantEarnedRevenueTransactionType,
  TransactionTypes,
} from '@cardstack/types';
import { getMerchantEarnedTransactionDetails } from '@cardstack/utils';

import { BaseStrategy } from '../base-strategy';

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

    const price = await fetchHistoricalPrice(
      symbol,
      prepaidCardPaymentTransaction.timestamp,
      this.nativeCurrency
    );

    const amount = prepaidCardPaymentTransaction.issuingTokenAmount;

    const nativeBalance = convertRawAmountToNativeDisplay(
      amount,
      18,
      price,
      this.nativeCurrency
    );

    const transactionDetails = await getMerchantEarnedTransactionDetails(
      prepaidCardPaymentTransaction,
      this.nativeCurrency,
      symbol
    );

    return {
      balance: convertRawAmountToBalance(amount, {
        decimals: 18,
        symbol,
      }),
      native: nativeBalance,
      netEarned: transactionDetails.netEarned,
      netEarnedNativeDisplay: transactionDetails.netEarnedNativeDisplay,
      address: prepaidCardPaymentTransaction.merchantSafe?.id || '',
      token: {
        address: prepaidCardPaymentTransaction.issuingToken.id,
        symbol: prepaidCardPaymentTransaction.issuingToken.symbol,
        name: prepaidCardPaymentTransaction.issuingToken.name,
      },
      timestamp: prepaidCardPaymentTransaction.timestamp,
      type: TransactionTypes.MERCHANT_EARNED_REVENUE,
      transactionHash: this.transaction.id,
      transaction: transactionDetails,
      infoDid: prepaidCardPaymentTransaction.merchantSafe?.infoDid || undefined,
    };
  }
}
