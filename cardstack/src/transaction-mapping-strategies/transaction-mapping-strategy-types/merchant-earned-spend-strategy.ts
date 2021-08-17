import {
  convertAmountToNativeDisplay,
  convertRawAmountToBalance,
} from '@cardstack/cardpay-sdk';
import { BaseStrategy } from '../base-strategy';
import {
  MerchantEarnedRevenueTransactionType,
  MerchantEarnedSpendTransactionType,
  TransactionTypes,
} from '@cardstack/types';
import { getNativeBalance } from '@cardstack/services';
import { convertSpendForBalanceDisplay } from '@cardstack/utils';

export class MerchantEarnedSpendStrategy extends BaseStrategy {
  handlesTransaction(): boolean {
    const { prepaidCardPayments } = this.transaction;

    if (
      prepaidCardPayments?.[0] &&
      this.merchantSafeAddress &&
      prepaidCardPayments[0].merchantSafe?.id === this.merchantSafeAddress
    ) {
      return true;
    }

    return false;
  }

  async mapTransaction(): Promise<MerchantEarnedSpendTransactionType | null> {
    const prepaidCardPaymentTransaction = this.transaction
      .prepaidCardPayments?.[0];

    if (!prepaidCardPaymentTransaction) {
      return null;
    }

    const spendDisplay = convertSpendForBalanceDisplay(
      prepaidCardPaymentTransaction.spendAmount,
      this.nativeCurrency,
      this.currencyConversionRates,
      true
    );

    return {
      address: prepaidCardPaymentTransaction.prepaidCard.id,
      timestamp: prepaidCardPaymentTransaction.timestamp,
      type: TransactionTypes.MERCHANT_EARNED_SPEND,
      spendBalanceDisplay: spendDisplay.tokenBalanceDisplay,
      nativeBalanceDisplay: spendDisplay.nativeBalanceDisplay,
      transactionHash: this.transaction.id,
    };
  }
}
