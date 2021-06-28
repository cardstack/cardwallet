import { TransactionTypes } from './TransactionTypes';

export interface CreatedPrepaidCardTransactionType {
  address: string;
  createdAt: number;
  spendAmount: number;
  issuingToken: {
    address: string;
    symbol?: string | null;
    name?: string | null;
    balance: {
      amount: string;
      display: string;
    };
    native: {
      amount: string;
      display: string;
    };
  };
  spendBalanceDisplay: string;
  nativeBalanceDisplay: string;
  transactionHash: string;
  type: TransactionTypes.CREATED_PREPAID_CARD;
}
