import { BaseStrategy } from './base-strategy';
import {
  PrepaidCardSplitTransactionType,
  TransactionTypes,
} from '@cardstack/types';
import { convertSpendForBalanceDisplay } from '@cardstack/utils';

export class PrepaidCardSplitStrategy extends BaseStrategy {
  handlesTransaction(): boolean {
    const { prepaidCardSplits } = this.transaction;

    if (prepaidCardSplits?.[0]) {
      return true;
    }

    return false;
  }

  mapTransaction(): PrepaidCardSplitTransactionType | null {
    const prepaidCardSplitTransaction = this.transaction.prepaidCardSplits?.[0];

    if (!prepaidCardSplitTransaction) {
      return null;
    }

    const spendAmount = prepaidCardSplitTransaction.faceValues[0] || 0;

    const spendDisplay = convertSpendForBalanceDisplay(
      spendAmount,
      this.nativeCurrency,
      this.currencyConversionRates,
      true
    );

    return {
      address: prepaidCardSplitTransaction.prepaidCard.id,
      timestamp: prepaidCardSplitTransaction.timestamp,
      spendAmount,
      spendBalanceDisplay: spendDisplay.tokenBalanceDisplay,
      prepaidCardCount: prepaidCardSplitTransaction.faceValues.length,
      transactionHash: this.transaction.id,
      type: TransactionTypes.PREPAID_CARD_SPLIT,
    };
  }
}
