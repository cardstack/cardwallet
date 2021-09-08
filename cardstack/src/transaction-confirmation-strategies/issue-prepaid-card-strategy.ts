import { getAddressByNetwork } from '@cardstack/cardpay-sdk';
import { BaseStrategyWithLevel1Data } from './base-strategy';
import { safeDecodeParameters } from './decoding-utils';
import {
  IssuePrepaidCardDecodedData,
  TransactionConfirmationType,
} from '@cardstack/types';
import { logger } from '@rainbow-me/utils';

export class IssuePrepaidCardStrategy extends BaseStrategyWithLevel1Data {
  isApplicable(): boolean {
    const prepaidCardManager = getAddressByNetwork(
      'prepaidCardManager',
      this.network
    );

    return this.level1Data.to === prepaidCardManager;
  }

  public async decodeRequest(): Promise<IssuePrepaidCardDecodedData> {
    const decodedPrepaidCardData = safeDecodeParameters<{
      owner: string;
      issuingTokenAmounts: string[];
      spendAmounts: string[];
      customizationDID: string;
      marketAddress: string;
    }>(
      [
        { type: 'address', name: 'owner' },
        { type: 'uint256[]', name: 'issuingTokenAmounts' },
        { type: 'uint256[]', name: 'spendAmounts' },
        { type: 'string', name: 'customizationDID' },
        { type: 'string', name: 'marketAddress' },
      ],
      this.level1Data.data
    );

    if (!decodedPrepaidCardData) {
      logger.sentry('Error decoding prepaid card data', this.level1Data.data);
      throw new Error('Error decoding prepaid card data');
    }

    const tokenAddress = this.message.to;
    const tokenData = await this.getTokenData(tokenAddress);

    return {
      ...this.level1Data,
      ...decodedPrepaidCardData,
      token: tokenData,
      type: TransactionConfirmationType.ISSUE_PREPAID_CARD,
    };
  }
}
