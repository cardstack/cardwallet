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

    const prepaidCardInventoryEvent = this.transaction
      .prepaidCardInventoryEvents?.[0];

    if (prepaidCardTransferTransaction.prepaidCard.customizationDID) {
      try {
        cardCustomization = await fetchCardCustomizationFromDID(
          prepaidCardTransferTransaction.prepaidCard.customizationDID
        );
      } catch (error) {}
    }

    const { nativeBalanceDisplay } = convertSpendForBalanceDisplay(
      prepaidCardInventoryEvent
        ? prepaidCardInventoryEvent.inventoryProvisioned?.inventory.sku
            .faceValue
        : prepaidCardTransferTransaction.prepaidCard.creation?.spendAmount, // faceValue when transfer happen
      this.nativeCurrency,
      this.currencyConversionRates,
      true
    );

    const isReceived =
      prepaidCardTransferTransaction.to.id === this.accountAddress;

    const TransferText = isReceived ? 'Received' : 'Transferred';
    const statusText = prepaidCardInventoryEvent ? 'Purchased' : TransferText;

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
