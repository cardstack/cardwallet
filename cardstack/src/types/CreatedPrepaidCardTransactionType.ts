import { TransactionType } from './TransactionType';

export interface CreatedPrepaidCardTransactionType {
  address: string;
  createdAt: number;
  spendAmount: number;
  issuingTokenAmount: number;
  issuingToken: {
    address: string;
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
  type: TransactionType.CREATED_PREPAID_CARD;
}
