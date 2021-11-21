import {
  AdvancedTransactionFragment,
  TransactionType,
  CurrencyConversionRates,
} from '@cardstack/types';

interface BaseStrategyParams {
  transaction: AdvancedTransactionFragment;
  accountAddress: string;
  nativeCurrency: string;
  currencyConversionRates: CurrencyConversionRates;
  merchantSafeAddresses: string[];
  prepaidCardAddresses: string[];
  merchantSafeAddress?: string;
  depotAddress: string;
  isDepotTransaction?: boolean;
}

export abstract class BaseStrategy {
  abstract handlesTransaction(): boolean;
  abstract mapTransaction():
    | Promise<TransactionType | null>
    | (TransactionType | null);

  transaction: AdvancedTransactionFragment;
  accountAddress: string;
  nativeCurrency: string;
  currencyConversionRates: CurrencyConversionRates;
  depotAddress: string;
  merchantSafeAddresses: string[];
  prepaidCardAddresses: string[];
  merchantSafeAddress?: string;
  isDepotTransaction?: boolean;

  constructor({
    transaction,
    accountAddress,
    nativeCurrency,
    currencyConversionRates,
    merchantSafeAddresses,
    prepaidCardAddresses,
    merchantSafeAddress,
    depotAddress,
    isDepotTransaction,
  }: BaseStrategyParams) {
    this.transaction = transaction;
    this.accountAddress = accountAddress;
    this.nativeCurrency = nativeCurrency;
    this.currencyConversionRates = currencyConversionRates;
    this.merchantSafeAddresses = merchantSafeAddresses;
    this.prepaidCardAddresses = prepaidCardAddresses;
    this.merchantSafeAddress = merchantSafeAddress;
    this.depotAddress = depotAddress;
    this.isDepotTransaction = isDepotTransaction;
  }
}
