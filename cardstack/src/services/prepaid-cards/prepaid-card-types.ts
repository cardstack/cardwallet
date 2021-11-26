import { NativeCurrency } from '@cardstack/cardpay-sdk';
import { PrepaidCardType } from '@cardstack/types';

export interface PrepaidCardsQueryResult {
  prepaidCards: PrepaidCardType[];
}

export interface PrepaidCardSafeQueryParams {
  accountAddress: string;
  nativeCurrency: NativeCurrency;
}
