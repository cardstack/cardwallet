import {
  CreatedPrepaidCardTransactionType,
  BridgedTokenTransactionType,
} from '@cardstack/types';

export type TransactionType =
  | BridgedTokenTransactionType
  | CreatedPrepaidCardTransactionType;
