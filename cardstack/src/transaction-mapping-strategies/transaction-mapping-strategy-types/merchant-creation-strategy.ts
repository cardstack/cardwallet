import { BaseStrategy } from '../base-strategy';
import {
  MerchantCreationTransactionType,
  TransactionTypes,
} from '@cardstack/types';

export class MerchantCreationStrategy extends BaseStrategy {
  handlesTransaction(): boolean {
    const { merchantCreations } = this.transaction;

    if (merchantCreations?.[0]) {
      return true;
    }

    return false;
  }

  mapTransaction(): MerchantCreationTransactionType | null {
    const merchantCreationTransaction = this.transaction.merchantCreations?.[0];

    if (!merchantCreationTransaction) {
      return null;
    }

    return {
      address: merchantCreationTransaction.id,
      createdAt: merchantCreationTransaction.createdAt,
      infoDid: merchantCreationTransaction?.merchantSafe?.infoDid || undefined,
      transactionHash: this.transaction.id,
      type: TransactionTypes.MERCHANT_CREATION,
    };
  }
}
