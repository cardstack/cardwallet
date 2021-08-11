import { getAddressByNetwork } from '@cardstack/cardpay-sdk';
import { BaseStrategy, DecodingStrategy } from './base-strategy';
import { logger } from '@rainbow-me/utils';
import {
  IssuePrepaidCardDecodedData,
  TransactionConfirmationType,
} from '@cardstack/types';

export class IssuePrepaidCardStrategy
  extends BaseStrategy
  implements DecodingStrategy {
  isHandler(): boolean {
    if (this.level1Data) {
      const prepaidCardManager = getAddressByNetwork(
        'prepaidCardManager',
        this.network
      );

      if (this.level1Data.to === prepaidCardManager) {
        return true;
      }
    }

    return false;
  }

  public async decodeData(): Promise<IssuePrepaidCardDecodedData> {
    if (this.level1Data) {
      const decodedPrepaidCardData = this.decode<{
        owner: string;
        issuingTokenAmounts: string[];
        spendAmounts: string[];
        customizationDID: string;
      }>(
        [
          { type: 'address', name: 'owner' },
          { type: 'uint256[]', name: 'issuingTokenAmounts' },
          { type: 'uint256[]', name: 'spendAmounts' },
          { type: 'string', name: 'customizationDID' },
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

    logger.sentry(
      'Decoding prepaid card data error - level 1 data should exist'
    );

    throw new Error('Level 1 Data should exist.');
  }
}
