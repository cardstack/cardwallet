import {
  TransactionConfirmationData,
  TransactionConfirmationType,
} from '../types/transaction-confirmation-types';
import { IssuePrepaidCardStrategy } from './issue-prepaid-card-strategy';
import { safeDecodeParameters } from './utils';
import logger from 'logger';
import { Level1DecodedData } from '@cardstack/types';

interface TransactionRequestData {
  message: {
    to: string;
    data: string;
  };
  verifyingContract: string;
  primaryType: string;
  network: string;
  nativeCurrency: string;
  level1Data: Level1DecodedData | null;
}

const strategies = [IssuePrepaidCardStrategy];

export class TransactionConfirmationContext {
  transactionRequestData: TransactionRequestData;

  constructor(
    message: {
      to: string;
      data: string;
    },
    verifyingContract: string,
    primaryType: string,
    network: string,
    nativeCurrency: string
  ) {
    const data = message.data.slice(10);

    const decodedData = safeDecodeParameters<Level1DecodedData>(
      [
        { type: 'address', name: 'to' },
        { type: 'uint256', name: 'amount' },
        { type: 'bytes', name: 'data' },
      ],
      data
    );

    this.transactionRequestData = {
      message,
      verifyingContract,
      primaryType,
      network,
      nativeCurrency,
      level1Data: decodedData,
    };
  }

  async getDecodedData(): Promise<TransactionConfirmationData> {
    for (let i = 0; i < strategies.length; i++) {
      const strategy = new strategies[i](this.transactionRequestData);

      if (strategy.shouldDecodeRequest()) {
        return strategy.decodeRequest();
      }
    }

    logger.sentry('Unable to decode message.', this.transactionRequestData);

    return {
      type: TransactionConfirmationType.GENERIC,
    };
  }
}
