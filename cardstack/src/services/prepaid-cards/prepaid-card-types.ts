import { NativeCurrency } from '@cardstack/cardpay-sdk';
import { SignedProviderParams } from '@cardstack/models/hd-provider';
import { PrepaidCardType } from '@cardstack/types';

export interface PrepaidCardsQueryResult {
  prepaidCards: PrepaidCardType[];
}

export interface PrepaidCardSafeQueryParams {
  accountAddress: string;
  nativeCurrency: NativeCurrency;
}

export interface PrepaidCardTransferQueryParams extends SignedProviderParams {
  accountAddress: string;
  prepaidCardAddress: string;
  newOwner: string;
}
