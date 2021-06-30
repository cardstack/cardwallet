import { MerchantCreationTransactionType } from './MerchantCreationTransactionType';
import {
  CreatedPrepaidCardTransactionType,
  BridgedTokenTransactionType,
  PrepaidCardPaymentTransactionType,
} from '@cardstack/types';

export type TransactionType =
  | BridgedTokenTransactionType
  | CreatedPrepaidCardTransactionType
  | MerchantCreationTransactionType
  | PrepaidCardPaymentTransactionType;
