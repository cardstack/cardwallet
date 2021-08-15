import { BaseStrategy } from '../base-strategy';
import {
  PrepaidCardTransferTransactionType,
  TransactionTypes,
} from '@cardstack/types';
import { convertSpendForBalanceDisplay } from '@cardstack/utils';

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

    const spendAmount = prepaidCardTransferTransaction.prepaidCard.spendBalance;

    const spendDisplay = convertSpendForBalanceDisplay(
      spendAmount,
      this.nativeCurrency,
      this.currencyConversionRates,
      true
    );

    return {
      address: prepaidCardTransferTransaction.prepaidCard.id,
      timestamp: prepaidCardTransferTransaction.timestamp,
      spendAmount,
      spendBalanceDisplay: spendDisplay.tokenBalanceDisplay,
      nativeBalanceDisplay: spendDisplay.nativeBalanceDisplay,
      transactionHash: this.transaction.id,
      type: TransactionTypes.PREPAID_CARD_TRANSFER,
    };
  }
}
