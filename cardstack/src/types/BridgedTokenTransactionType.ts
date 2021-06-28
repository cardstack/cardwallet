import { TransactionTypes } from './TransactionTypes';

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
  token: {
    address: string;
    name?: string | null;
    symbol?: string | null;
  };
  timestamp: number;
  type: TransactionTypes.BRIDGED;
}
