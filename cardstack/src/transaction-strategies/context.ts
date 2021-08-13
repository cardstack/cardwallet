import { PrepaidCardSplitStrategy } from './transaction-mapping-strategy-types/prepaid-card-split-strategy';
import { MerchantClaimStrategy } from './transaction-mapping-strategy-types/merchant-claim-strategy';
import { PrepaidCardCreationStrategy } from './transaction-mapping-strategy-types/prepaid-card-creation-strategy';
import { PrepaidCardTransferStrategy } from './transaction-mapping-strategy-types/prepaid-card-transfer-strategy';
import { BridgeToLayer1EventStrategy } from './transaction-mapping-strategy-types/bridge-to-layer1-strategy';
import { BridgeToLayer2EventStrategy } from './transaction-mapping-strategy-types/bridge-to-layer2-strategy';
import { MerchantCreationStrategy } from './transaction-mapping-strategy-types/merchant-creation-strategy';
import { ERC20TokenStrategy } from './transaction-mapping-strategy-types/erc20-token-strategy';
import { PrepaidCardPaymentStrategy } from './transaction-mapping-strategy-types/prepaid-card-payment-strategy';
import logger from 'logger';
import { TransactionFragment } from '@cardstack/graphql';
import { CurrencyConversionRates, TransactionType } from '@cardstack/types';

interface TransactionData {
  transactions: (TransactionFragment | undefined)[];
  accountAddress: string;
  nativeCurrency: string;
  currencyConversionRates: CurrencyConversionRates;
}

// Transaction mapping strategies list
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

// Map graphql transactions list response into readable values in UI
export class TransactionMappingContext {
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

          logger.sentry('Unable to map transaction:', transaction);

          return null;
        }
      )
    );

    // Remove null values from transactions list
    return mappedTransactions.filter(t => t);
  }
}
