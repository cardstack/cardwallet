import { TransactionTypes } from './TransactionTypes';

export interface MerchantCreationTransactionType {
  address: string;
  createdAt: string;
  infoDid?: string | null;
  transactionHash: string;
  type: TransactionTypes.MERCHANT_CREATION;
}
