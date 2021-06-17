import { TransactionType } from './TransactionType';

export interface BridgedTokenTransactionType {
  balance: {
    amount: string;
    display: string;
  };
  native: {
    amount: string;
    display: string;
  };
  transactionHash: string;
  to: string;
  token: string;
  timestamp: number;
  type: TransactionType.BRIDGED;
}
