import {
  PrepaidCardTransferTransactionType,
  TransactionTypes,
} from '@cardstack/types';
import {
  convertSpendForBalanceDisplay,
  fetchCardCustomizationFromDID,
} from '@cardstack/utils';

import { BaseStrategy } from '../base-strategy';

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

    const prepaidCardInventoryEvent = this.transaction
      .prepaidCardInventoryEvents?.[0];

    if (prepaidCardTransferTransaction.prepaidCard.customizationDID) {
      try {
        cardCustomization = await fetchCardCustomizationFromDID(
          prepaidCardTransferTransaction.prepaidCard.customizationDID
        );
      } catch (error) {}
    }

    const { nativeBalanceDisplay } = await convertSpendForBalanceDisplay(
      prepaidCardInventoryEvent
        ? prepaidCardInventoryEvent.inventoryProvisioned?.inventory.sku
            .faceValue
        : prepaidCardTransferTransaction.prepaidCard.creation?.spendAmount, // faceValue when transfer happen
      this.nativeCurrency
    );

    const isReceived =
      prepaidCardTransferTransaction.to.id === this.accountAddress;

    const TransferStatusText = isReceived ? 'Received' : 'Transferred';

    const statusText = prepaidCardInventoryEvent
      ? 'Purchased'
      : TransferStatusText;

    return {
      address: prepaidCardInventoryEvent
        ? prepaidCardInventoryEvent.inventoryProvisioned?.inventory.sku.issuer
            .id || ''
        : prepaidCardTransferTransaction.prepaidCard.id,
      cardCustomization,
      timestamp: prepaidCardInventoryEvent
        ? prepaidCardInventoryEvent.inventoryProvisioned?.timestamp
        : prepaidCardTransferTransaction.timestamp,
      nativeBalanceDisplay,
      transactionHash: this.transaction.id,
      statusText,
      type: TransactionTypes.PREPAID_CARD_TRANSFER,
    };
  }
}
