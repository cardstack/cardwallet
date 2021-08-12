import { PrepaidCardSplitStrategy } from './prepaid-card-split-strategy';
import { TransactionFragment } from '@cardstack/graphql';
import { CurrencyConversionRates, TransactionType } from '@cardstack/types';

interface TransactionData {
  transactions: (TransactionFragment | undefined)[];
  nativeCurrency: string;
  currencyConversionRates: CurrencyConversionRates;
}

const transactionStrategies = [PrepaidCardSplitStrategy];

export class TransactionContext {
  constructor(readonly transactionData: TransactionData) {}

  async mapTransactions() {
    const mappedTransactions = await Promise.all(
      this.transactionData.transactions.map<Promise<TransactionType | null>>(
        async (transaction: TransactionFragment | undefined) => {
          if (!transaction) {
            return null;
          }

          for (let i = 0; i < transactionStrategies.length; i++) {
            const strategy = new transactionStrategies[i]({
              transaction,
              nativeCurrency: this.transactionData.nativeCurrency,
              currencyConversionRates: this.transactionData
                .currencyConversionRates,
            });

            if (strategy.handlesTransaction()) {
              const mappedTransaction = await strategy.mapTransaction();

              return mappedTransaction;
            }
          }

          return null;
        }
      )
    );

    return mappedTransactions.filter(t => t);
  }
}
