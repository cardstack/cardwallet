import { TransactionFragment } from '@cardstack/graphql';
import { TransactionType, CurrencyConversionRates } from '@cardstack/types';

interface BaseStrategyParams {
  transaction: TransactionFragment;
  accountAddress: string;
  nativeCurrency: string;
  currencyConversionRates: CurrencyConversionRates;
  merchantSafeAddresses: string[];
  merchantSafeAddress?: string;
}

export abstract class BaseStrategy {
  abstract handlesTransaction(): boolean;
  abstract mapTransaction():
    | Promise<TransactionType | null>
    | (TransactionType | null);

  transaction: TransactionFragment;
  accountAddress: string;
  nativeCurrency: string;
  currencyConversionRates: CurrencyConversionRates;
  merchantSafeAddresses: string[];
  merchantSafeAddress?: string;

  constructor({
    transaction,
    accountAddress,
    nativeCurrency,
    currencyConversionRates,
    merchantSafeAddresses,
    merchantSafeAddress,
  }: BaseStrategyParams) {
    this.transaction = transaction;
    this.accountAddress = accountAddress;
    this.nativeCurrency = nativeCurrency;
    this.currencyConversionRates = currencyConversionRates;
    this.merchantSafeAddresses = merchantSafeAddresses;
    this.merchantSafeAddress = merchantSafeAddress;
  }
}
