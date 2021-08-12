import {
  TransactionConfirmationData,
  TransactionConfirmationType,
  ActionDispatcherDecodedData,
} from '../types/transaction-confirmation-types';
import { PayMerchantStrategy } from './pay-merchant-strategy';

import { WithdrawalStrategy } from './withdrawal-strategy';
import { HubAuthenticationStrategy } from './hub-authentication-strategy';
import { IssuePrepaidCardStrategy } from './issue-prepaid-card-strategy';
import { safeDecodeParameters } from './decoding-utils';
import { ClaimRevenueStrategy } from './claim-revenue-strategy';
import { TransferPrepaidCard1Strategy } from './transfer-prepaid-card-1-strategy';
import { RegisterMerchantStrategy } from './register-merchant-strategy';
import { SplitPrepaidCardStrategy } from './split-prepaid-card-strategy';
import { TransferPrepaidCard2Strategy } from './transfer-prepaid-card-2-strategy';
import logger from 'logger';
import { Level1DecodedData } from '@cardstack/types';

interface TransactionRequestData {
  message: {
    to: string;
    data?: string;
  };
  verifyingContract: string;
  primaryType: string;
  network: string;
  nativeCurrency: string;
  level1Data: Level1DecodedData | null;
  actionDispatcherData: ActionDispatcherDecodedData | null;
}

const strategies = [
  HubAuthenticationStrategy,
  ClaimRevenueStrategy,
  TransferPrepaidCard1Strategy,
  IssuePrepaidCardStrategy,
  WithdrawalStrategy,
  RegisterMerchantStrategy,
  PayMerchantStrategy,
  SplitPrepaidCardStrategy,
  TransferPrepaidCard2Strategy,
];

export class TransactionConfirmationContext {
  transactionRequestData: TransactionRequestData;

  constructor(
    message: {
      to: string;
      data?: string;
    },
    verifyingContract: string,
    primaryType: string,
    network: string,
    nativeCurrency: string
  ) {
    let level1Data: Level1DecodedData | null = null,
      actionDispatcherData: ActionDispatcherDecodedData | null = null;

    if (message.data) {
      const data = message.data.slice(10);

      level1Data = safeDecodeParameters<Level1DecodedData>(
        [
          { type: 'address', name: 'to' },
          { type: 'uint256', name: 'amount' },
          { type: 'bytes', name: 'data' },
        ],
        data
      );
    }

    if (level1Data) {
      actionDispatcherData = safeDecodeParameters<ActionDispatcherDecodedData>(
        [
          { type: 'uint256', name: 'spendAmount' },
          { type: 'uint256', name: 'requestedRate' },
          { type: 'string', name: 'actionName' },
          { type: 'bytes', name: 'actionData' },
        ],
        level1Data.data
      );
    }

    this.transactionRequestData = {
      message,
      verifyingContract,
      primaryType,
      network,
      nativeCurrency,
      level1Data,
      actionDispatcherData,
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
