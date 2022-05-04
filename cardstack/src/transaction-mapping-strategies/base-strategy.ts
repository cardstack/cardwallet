import { NativeCurrency } from '@cardstack/cardpay-sdk';

import {
  AdvancedTransactionFragment,
  TransactionType,
  CurrencyConversionRates,
} from '@cardstack/types';

interface BaseStrategyParams {
  transaction: AdvancedTransactionFragment;
  accountAddress: string;
  nativeCurrency: NativeCurrency;
  currencyConversionRates: CurrencyConversionRates;
  merchantSafeAddresses: string[];
  prepaidCardAddresses: string[];
  merchantSafeAddress?: string;
  depotAddress: string;
  isDepotTransaction?: boolean;
}

export abstract class BaseStrategy implements BaseStrategyParams {
  abstract handlesTransaction(): boolean;
  abstract mapTransaction():
    | Promise<TransactionType | null>
    | (TransactionType | null);

  transaction: AdvancedTransactionFragment;
  accountAddress: string;
  nativeCurrency: NativeCurrency;
  currencyConversionRates: CurrencyConversionRates;
  merchantSafeAddresses: string[];
  prepaidCardAddresses: string[];
  merchantSafeAddress?: string;
  depotAddress: string;
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
