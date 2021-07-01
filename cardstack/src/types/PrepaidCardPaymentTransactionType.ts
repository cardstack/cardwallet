import { TransactionTypes } from './TransactionTypes';

export interface PrepaidCardPaymentTransactionType {
  address: string;
  timestamp: number;
  spendAmount: string;
  spendBalanceDisplay: string;
  nativeBalanceDisplay: string;
  type: TransactionTypes.PREPAID_CARD_PAYMENT;
  transactionHash: string;
}
