import { PrepaidCardSplitStrategy } from './transaction-mapping-strategy-types/prepaid-card-split-strategy';
import { MerchantClaimStrategy } from './transaction-mapping-strategy-types/merchant-claim-strategy';
import { PrepaidCardCreationStrategy } from './transaction-mapping-strategy-types/prepaid-card-creation-strategy';
import { PrepaidCardTransferStrategy } from './transaction-mapping-strategy-types/prepaid-card-transfer-strategy';
import { BridgeToLayer1EventStrategy } from './transaction-mapping-strategy-types/bridge-to-layer1-strategy';
import { BridgeToLayer2EventStrategy } from './transaction-mapping-strategy-types/bridge-to-layer2-strategy';
import { MerchantCreationStrategy } from './transaction-mapping-strategy-types/merchant-creation-strategy';
import { ERC20TokenStrategy } from './transaction-mapping-strategy-types/erc20-token-strategy';
import { PrepaidCardPaymentStrategy } from './transaction-mapping-strategy-types/prepaid-card-payment-strategy';
import { MerchantEarnedRevenueStrategy } from './transaction-mapping-strategy-types/merchant-earned-revenue-strategy';
import { MerchantEarnedSpendStrategy } from './transaction-mapping-strategy-types/merchant-earned-spend-strategy';
import logger from 'logger';
import { TransactionFragment } from '@cardstack/graphql';
import { CurrencyConversionRates, TransactionType } from '@cardstack/types';

export type TransactionMappingStrategy =
  | typeof PrepaidCardSplitStrategy
  | typeof MerchantClaimStrategy
  | typeof PrepaidCardCreationStrategy
  | typeof PrepaidCardPaymentStrategy
  | typeof PrepaidCardTransferStrategy
  | typeof BridgeToLayer1EventStrategy
  | typeof BridgeToLayer2EventStrategy
  | typeof MerchantCreationStrategy
  | typeof MerchantEarnedSpendStrategy
  | typeof MerchantEarnedRevenueStrategy;

interface TransactionData {
  transactions: (TransactionFragment | undefined)[];
  accountAddress: string;
  nativeCurrency: string;
  currencyConversionRates: CurrencyConversionRates;
  transactionStrategies?: TransactionMappingStrategy[];
  depotAddress: string;
  merchantSafeAddress?: string;
}

// used for the full transaction list
const defaultTransactionStrategies = [
  PrepaidCardSplitStrategy,
  MerchantClaimStrategy,
  PrepaidCardCreationStrategy,
  PrepaidCardPaymentStrategy,
  PrepaidCardTransferStrategy,
  BridgeToLayer1EventStrategy,
  BridgeToLayer2EventStrategy,
  MerchantCreationStrategy,
];

// Map graphql transactions list response into readable values in UI
export class TransactionMappingContext {
  constructor(readonly transactionData: TransactionData) {}

  async mapTransactions() {
    const transactionStrategies =
      this.transactionData.transactionStrategies ||
      defaultTransactionStrategies;

    const mappedTransactions = await Promise.all(
      this.transactionData.transactions.map<Promise<TransactionType | null>>(
        async (transaction: TransactionFragment | undefined) => {
          try {
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
                merchantSafeAddress: this.transactionData.merchantSafeAddress,
                depotAddress: this.transactionData.depotAddress,
              });

              if (strategy.handlesTransaction()) {
                const mappedTransaction = await strategy.mapTransaction();

                return mappedTransaction;
              }
            }

            // Check if it's tokenTransfer transaction at the end of mapping as other transaction types can have tokenTransfers
            const tokenTransferStrategy = new ERC20TokenStrategy({
              transaction,
              accountAddress: this.transactionData.accountAddress,
              nativeCurrency: this.transactionData.nativeCurrency,
              currencyConversionRates: this.transactionData
                .currencyConversionRates,
              depotAddress: this.transactionData.depotAddress,
            });

            if (tokenTransferStrategy.handlesTransaction()) {
              const mappedTransaction = await tokenTransferStrategy.mapTransaction();
              return mappedTransaction;
            }

            logger.sentry('Unable to map transaction:', transaction);
          } catch (error) {
            logger.sentry('Error mapping transaction:', transaction);
          }

          return null;
        }
      )
    );

    // Remove null values from transactions list
    return mappedTransactions.filter(t => t);
  }
}
