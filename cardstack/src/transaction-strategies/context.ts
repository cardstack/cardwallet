import { PrepaidCardSplitStrategy } from './prepaid-card-split-strategy';
import { MerchantClaimStrategy } from './merchant-claim-strategy';
import { PrepaidCardCreationStrategy } from './prepaid-card-creation-strategy';
import { PrepaidCardTransferStrategy } from './prepaid-card-transfer-strategy';
import { BridgeToLayer1EventStrategy } from './bridge-to-layer1-strategy';
import { BridgeToLayer2EventStrategy } from './bridge-to-layer2-strategy';
import { MerchantCreationStrategy } from './merchant-creation-strategy';
import { ERC20TokenStrategy } from './erc20-token-strategy';
import { PrepaidCardPaymentStrategy } from './prepaid-card-payment-strategy';
import { TransactionFragment } from '@cardstack/graphql';
import { CurrencyConversionRates, TransactionType } from '@cardstack/types';

interface TransactionData {
  transactions: (TransactionFragment | undefined)[];
  accountAddress: string;
  nativeCurrency: string;
  currencyConversionRates: CurrencyConversionRates;
}

const transactionStrategies = [
  PrepaidCardSplitStrategy,
  MerchantClaimStrategy,
  PrepaidCardCreationStrategy,
  PrepaidCardPaymentStrategy,
  PrepaidCardTransferStrategy,
  BridgeToLayer1EventStrategy,
  BridgeToLayer2EventStrategy,
  MerchantCreationStrategy,
  ERC20TokenStrategy,
];

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
              accountAddress: this.transactionData.accountAddress,
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
