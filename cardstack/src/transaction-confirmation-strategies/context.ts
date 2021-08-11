import {
  TransactionConfirmationType,
  TransactionConfirmationData,
} from './../types/transaction-confirmation-types';
import { BaseStrategy } from './base-strategy';
import { IssuePrepaidCardStrategy } from './issue-prepaid-card-strategy';
import logger from 'logger';

export class TransactionConfirmationContext extends BaseStrategy {
  strategies = [IssuePrepaidCardStrategy];

  async getDecodedData(): Promise<TransactionConfirmationData> {
    const constructorData = {
      message: this.message,
      verifyingContract: this.verifyingContract,
      primaryType: this.primaryType,
      network: this.network,
      nativeCurrency: this.nativeCurrency,
    };

    for (let i = 0; i < this.strategies.length; i++) {
      const strategy = new this.strategies[i](constructorData);

      if (strategy.isHandler()) {
        return strategy.decodeData();
      }
    }

    logger.sentry('Unable to decode message.', constructorData);

    return {
      type: TransactionConfirmationType.GENERIC,
    };
  }
}
