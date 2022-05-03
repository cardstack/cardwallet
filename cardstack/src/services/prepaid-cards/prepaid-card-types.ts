import { NativeCurrency } from '@cardstack/cardpay-sdk';

import { SignerParamsBase } from '@cardstack/models/ethers-wallet';
import { PrepaidCardType } from '@cardstack/types';

interface SignedPrepaidCardBaseParams extends SignerParamsBase {
  accountAddress: string;
  prepaidCardAddress: string;
}

export interface PrepaidCardsQueryResult {
  prepaidCards: PrepaidCardType[];
}

export interface PrepaidCardSafeQueryParams {
  accountAddress: string;
  nativeCurrency: NativeCurrency;
}

export interface PrepaidCardTransferQueryParams
  extends SignedPrepaidCardBaseParams {
  newOwner: string;
}

export interface PrepaidCardPayMerchantQueryParams
  extends SignedPrepaidCardBaseParams {
  spendAmount: number;
  merchantAddress: string;
}
