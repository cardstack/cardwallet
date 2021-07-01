import { MerchantCreationTransactionType } from './MerchantCreationTransactionType';
import { TransactionItemType } from './TransactionItemType';
import {
  CreatedPrepaidCardTransactionType,
  BridgedTokenTransactionType,
  PrepaidCardPaymentTransactionType,
} from '@cardstack/types';

export type TransactionType =
  | TransactionItemType
  | BridgedTokenTransactionType
  | CreatedPrepaidCardTransactionType
  | MerchantCreationTransactionType
  | PrepaidCardPaymentTransactionType;
