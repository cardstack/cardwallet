import { BaseStrategy } from '../base-strategy';
import {
  PrepaidCardPaymentTransactionType,
  TransactionTypes,
} from '@cardstack/types';
import {
  convertSpendForBalanceDisplay,
  fetchCardCustomizationFromDID,
  fetchMerchantInfoFromDID,
} from '@cardstack/utils';

export class PrepaidCardPaymentStrategy extends BaseStrategy {
  handlesTransaction(): boolean {
    const { prepaidCardPayments } = this.transaction;

    return Boolean(
      prepaidCardPayments?.[0] &&
        this.prepaidCardAddresses.includes(
          prepaidCardPayments[0].prepaidCard.id
        )
    );
  }

  async mapTransaction(): Promise<PrepaidCardPaymentTransactionType | null> {
    const prepaidCardPaymentTransaction = this.transaction
      .prepaidCardPayments?.[0];

    if (!prepaidCardPaymentTransaction) {
      return null;
    }

    let cardCustomization;
    let merchantInfo;

    if (prepaidCardPaymentTransaction.prepaidCard?.customizationDID) {
      try {
        cardCustomization = await fetchCardCustomizationFromDID(
          prepaidCardPaymentTransaction.prepaidCard.customizationDID
        );
      } catch (error) {}
    }

    if (prepaidCardPaymentTransaction.merchantSafe?.infoDid) {
      try {
        merchantInfo = await fetchMerchantInfoFromDID(
          prepaidCardPaymentTransaction.merchantSafe?.infoDid
        );
      } catch (error) {}
    }

    const { nativeBalanceDisplay } = convertSpendForBalanceDisplay(
      prepaidCardPaymentTransaction.spendAmount,
      this.nativeCurrency,
      this.currencyConversionRates,
      true
    );

    return {
      address: prepaidCardPaymentTransaction.prepaidCard.id,
      timestamp: prepaidCardPaymentTransaction.timestamp,
      spendAmount: prepaidCardPaymentTransaction.spendAmount,
      type: TransactionTypes.PREPAID_CARD_PAYMENT,
      merchantSafeAddress: prepaidCardPaymentTransaction.merchantSafe?.id || '',
      transactionHash: this.transaction.id,
      nativeBalanceDisplay,
      cardCustomization,
      merchantInfo,
    };
  }
}
