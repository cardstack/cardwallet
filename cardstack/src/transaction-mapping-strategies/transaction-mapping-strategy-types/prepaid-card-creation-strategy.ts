import {
  convertRawAmountToBalance,
  convertRawAmountToNativeDisplay,
} from '@cardstack/cardpay-sdk';
import { BaseStrategy } from '../base-strategy';
import {
  PrepaidCardCreatedTransactionType,
  TransactionTypes,
} from '@cardstack/types';
import {
  convertSpendForBalanceDisplay,
  fetchCardCustomizationFromDID,
} from '@cardstack/utils';
import { fetchHistoricalPrice } from '@cardstack/services';

export class PrepaidCardCreationStrategy extends BaseStrategy {
  handlesTransaction(): boolean {
    const { prepaidCardCreations } = this.transaction;

    if (prepaidCardCreations?.[0]) {
      return true;
    }

    return false;
  }

  async mapTransaction(): Promise<PrepaidCardCreatedTransactionType | null> {
    const prepaidCardCreationTransaction = this.transaction
      .prepaidCardCreations?.[0];

    if (!prepaidCardCreationTransaction) {
      return null;
    }

    const spendDisplay = convertSpendForBalanceDisplay(
      prepaidCardCreationTransaction.spendAmount,
      this.nativeCurrency,
      this.currencyConversionRates,
      true
    );

    let cardCustomization;

    if (prepaidCardCreationTransaction.prepaidCard.customizationDID) {
      try {
        cardCustomization = await fetchCardCustomizationFromDID(
          prepaidCardCreationTransaction.prepaidCard.customizationDID
        );
      } catch (error) {}
    }

    let price = 0;

    if (prepaidCardCreationTransaction.issuingToken.symbol) {
      price = await fetchHistoricalPrice(
        prepaidCardCreationTransaction.issuingToken.symbol || '',
        prepaidCardCreationTransaction.createdAt,
        this.nativeCurrency
      );
    }

    return {
      address: prepaidCardCreationTransaction.prepaidCard.id,
      cardCustomization,
      createdAt: prepaidCardCreationTransaction.createdAt,
      createdFromAddress: prepaidCardCreationTransaction.createdFromAddress,
      spendAmount: prepaidCardCreationTransaction.spendAmount,
      issuingToken: {
        address: prepaidCardCreationTransaction.issuingToken.id,
        symbol: prepaidCardCreationTransaction.issuingToken.symbol,
        name: prepaidCardCreationTransaction.issuingToken.name,
        balance: convertRawAmountToBalance(
          prepaidCardCreationTransaction.issuingTokenAmount,
          {
            decimals: 18,
            symbol: prepaidCardCreationTransaction.issuingToken.symbol || '',
          }
        ),
        native: convertRawAmountToNativeDisplay(
          prepaidCardCreationTransaction.issuingTokenAmount,
          18,
          price,
          this.nativeCurrency
        ),
      },
      type: TransactionTypes.PREPAID_CARD_CREATED,
      spendBalanceDisplay: spendDisplay.tokenBalanceDisplay,
      nativeBalanceDisplay: spendDisplay.nativeBalanceDisplay,
      transactionHash: this.transaction.id,
    };
  }
}
