import { BaseStrategyWithActionDispatcherData } from './base-strategy';
import { decodeParameters } from './decoding-utils';
import {
  SplitPrepaidCardDecodedData,
  TransactionConfirmationType,
} from '@cardstack/types';

export class SplitPrepaidCardStrategy extends BaseStrategyWithActionDispatcherData {
  isApplicable(): boolean {
    return this.actionDispatcherData.actionName === 'split';
  }

  public async decodeRequest(): Promise<SplitPrepaidCardDecodedData> {
    const {
      issuingTokenAmounts,
      spendAmounts,
      customizationDID,
    } = decodeParameters<{
      issuingTokenAmounts: string[];
      spendAmounts: string[];
      customizationDID: string;
    }>(
      [
        { type: 'uint256[]', name: 'issuingTokenAmounts' },
        { type: 'uint256[]', name: 'spendAmounts' },
        { type: 'string', name: 'customizationDID' },
      ],
      this.actionDispatcherData.actionData
    );

    const tokenAddress = this.message.to;
    const tokenData = await this.getTokenData(tokenAddress);

    return {
      customizationDID,
      issuingTokenAmounts,
      spendAmounts,
      prepaidCard: this.verifyingContract,
      token: tokenData,
      type: TransactionConfirmationType.SPLIT_PREPAID_CARD,
    };
  }
}
