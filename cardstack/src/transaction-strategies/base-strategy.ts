import { TransactionFragment } from '@cardstack/graphql';
import { TransactionType, CurrencyConversionRates } from '@cardstack/types';

interface BaseStrategyParams {
  transaction: TransactionFragment;
  nativeCurrency: string;
  currencyConversionRates: CurrencyConversionRates;
}

export abstract class BaseStrategy {
  abstract handlesTransaction(): boolean;
  abstract mapTransaction():
    | Promise<TransactionType | null>
    | (TransactionType | null);

  transaction: TransactionFragment;
  nativeCurrency: string;
  currencyConversionRates: CurrencyConversionRates;

  constructor({
    transaction,
    nativeCurrency,
    currencyConversionRates,
  }: BaseStrategyParams) {
    this.transaction = transaction;
    this.nativeCurrency = nativeCurrency;
    this.currencyConversionRates = currencyConversionRates;
  }
}
