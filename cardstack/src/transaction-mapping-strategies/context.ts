import { flatten } from 'lodash';

import { TransactionTypes } from '../types/transaction-types';
import { BridgeToLayer1EventStrategy } from './transaction-mapping-strategy-types/bridge-to-layer1-strategy';
import { BridgeToLayer2EventStrategy } from './transaction-mapping-strategy-types/bridge-to-layer2-strategy';
import { ERC20TokenStrategy } from './transaction-mapping-strategy-types/erc20-token-strategy';
import { MerchantClaimStrategy } from './transaction-mapping-strategy-types/merchant-claim-strategy';
import { MerchantCreationStrategy } from './transaction-mapping-strategy-types/merchant-creation-strategy';
import { MerchantEarnedRevenueStrategy } from './transaction-mapping-strategy-types/merchant-earned-revenue-strategy';
import { MerchantEarnedSpendAndRevenueStrategy } from './transaction-mapping-strategy-types/merchant-earned-spend-and-revenue-strategy';
import { MerchantEarnedSpendStrategy } from './transaction-mapping-strategy-types/merchant-earned-spend-strategy';
import { PrepaidCardCreationStrategy } from './transaction-mapping-strategy-types/prepaid-card-creation-strategy';
import { PrepaidCardPaymentStrategy } from './transaction-mapping-strategy-types/prepaid-card-payment-strategy';
import { PrepaidCardSplitStrategy } from './transaction-mapping-strategy-types/prepaid-card-split-strategy';
import { PrepaidCardTransferStrategy } from './transaction-mapping-strategy-types/prepaid-card-transfer-strategy';
import logger from 'logger';
import { CurrencyConversionRates, TransactionType } from '@cardstack/types';
import { TransactionFragment } from '@cardstack/graphql';

export type TransactionMappingStrategy =
  | typeof PrepaidCardSplitStrategy
  | typeof MerchantClaimStrategy
  | typeof PrepaidCardCreationStrategy
  | typeof PrepaidCardPaymentStrategy
  | typeof PrepaidCardTransferStrategy
  | typeof BridgeToLayer1EventStrategy
  | typeof BridgeToLayer2EventStrategy
  | typeof MerchantCreationStrategy
  | typeof MerchantEarnedSpendAndRevenueStrategy
  | typeof MerchantEarnedSpendStrategy
  | typeof MerchantEarnedRevenueStrategy;

interface TransactionData {
  transactions: (TransactionFragment | undefined)[];
  accountAddress: string;
  nativeCurrency: string;
  currencyConversionRates: CurrencyConversionRates;
  transactionStrategies?: TransactionMappingStrategy[];
  merchantSafeAddresses: string[];
  prepaidCardAddresses: string[];
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
  MerchantEarnedSpendAndRevenueStrategy,
];

// specify transaction types that have additional potential handlers
const mapTransactionTypeToAdditionalHandlers = {
  [TransactionTypes.PREPAID_CARD_PAYMENT]: [
    MerchantEarnedSpendAndRevenueStrategy,
  ],
};

// Map graphql transactions list response into readable values in UI
export class TransactionMappingContext {
  constructor(readonly transactionData: TransactionData) {}

  async mapTransactions() {
    const transactionStrategies =
      this.transactionData.transactionStrategies ||
      defaultTransactionStrategies;

    const mappedTransactions = await Promise.all(
      this.transactionData.transactions.map<
        Promise<TransactionType | null | (TransactionType | null)[]>
      >(async (transaction: TransactionFragment | undefined) => {
        try {
          if (!transaction) {
            return null;
          }

          const strategyParam = {
            transaction,
            accountAddress: this.transactionData.accountAddress,
            nativeCurrency: this.transactionData.nativeCurrency,
            currencyConversionRates: this.transactionData
              .currencyConversionRates,
            merchantSafeAddresses: this.transactionData.merchantSafeAddresses,
            prepaidCardAddresses: this.transactionData.prepaidCardAddresses,
            merchantSafeAddress: this.transactionData.merchantSafeAddress,
          };

          for (let i = 0; i < transactionStrategies.length; i++) {
            const strategy = new transactionStrategies[i](strategyParam);

            if (strategy.handlesTransaction()) {
              const mappedTransaction = await strategy.mapTransaction();

              const additionalHandlers =
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore some types won't have a key on the map but that will just return undefined
                mapTransactionTypeToAdditionalHandlers[
                  mappedTransaction?.type || ''
                ];

              // a single transaction may be handled by multiple strategies
              if (additionalHandlers) {
                let allMappedTransactions = [mappedTransaction];

                for (let j = 0; j < additionalHandlers.length; j++) {
                  // only want to add the additional handler if the passed strategies includes it
                  if (transactionStrategies.includes(additionalHandlers[j])) {
                    const additionalStrategy = new additionalHandlers[j](
                      strategyParam
                    );

                    if (additionalStrategy.handlesTransaction()) {
                      const additionalMappedTransaction = await additionalStrategy.mapTransaction();

                      allMappedTransactions = [
                        ...allMappedTransactions,
                        additionalMappedTransaction,
                      ];
                    }
                  }
                }

                return allMappedTransactions;
              }

              return mappedTransaction;
            }
          }

          // Check if it's tokenTransfer transaction at the end of mapping as other transaction types can have tokenTransfers
          const tokenTransferStrategy = new ERC20TokenStrategy({
            transaction,
            accountAddress: this.transactionData.accountAddress,
            nativeCurrency: this.transactionData.nativeCurrency,
            merchantSafeAddresses: this.transactionData.merchantSafeAddresses,
            prepaidCardAddresses: this.transactionData.prepaidCardAddresses,
            currencyConversionRates: this.transactionData
              .currencyConversionRates,
          });

          if (tokenTransferStrategy.handlesTransaction()) {
            const mappedTransaction = await tokenTransferStrategy.mapTransaction();
            return mappedTransaction;
          }

          logger.sentry('Unable to map transaction:', transaction);
        } catch (error) {
          logger.sentry('Error mapping transaction:', error, transaction);
        }

        return null;
      })
    );

    const flattenedTransactions = flatten(mappedTransactions);

    // Remove null values from transactions list
    return flattenedTransactions.filter(t => t);
  }
}
