import { BaseStrategy } from '../base-strategy';
import {
  PrepaidCardTransferTransactionType,
  TransactionTypes,
} from '@cardstack/types';
import {
  convertSpendForBalanceDisplay,
  fetchCardCustomizationFromDID,
} from '@cardstack/utils';

export class PrepaidCardTransferStrategy extends BaseStrategy {
  handlesTransaction(): boolean {
    const { prepaidCardTransfers } = this.transaction;

    if (prepaidCardTransfers?.[0]) {
      return true;
    }

    return false;
  }

  async mapTransaction(): Promise<PrepaidCardTransferTransactionType | null> {
    const prepaidCardTransferTransaction = this.transaction
      .prepaidCardTransfers?.[0];

    if (!prepaidCardTransferTransaction) {
      return null;
    }

    let cardCustomization;

    if (prepaidCardTransferTransaction.prepaidCard.customizationDID) {
      try {
        cardCustomization = await fetchCardCustomizationFromDID(
          prepaidCardTransferTransaction.prepaidCard.customizationDID
        );
      } catch (error) {}
    }

    const faceValue = prepaidCardTransferTransaction.prepaidCard.faceValue;

    const spendDisplay = convertSpendForBalanceDisplay(
      faceValue,
      this.nativeCurrency,
      this.currencyConversionRates,
      true
    );

    return {
      address: prepaidCardTransferTransaction.prepaidCard.id,
      cardCustomization,
      timestamp: prepaidCardTransferTransaction.timestamp,
      spendBalanceDisplay: spendDisplay.tokenBalanceDisplay,
      nativeBalanceDisplay: spendDisplay.nativeBalanceDisplay,
      transactionHash: this.transaction.id,
      type: TransactionTypes.PREPAID_CARD_TRANSFER,
    };
  }
}
