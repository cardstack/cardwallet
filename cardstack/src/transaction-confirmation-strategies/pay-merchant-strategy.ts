import { MerchantSafe } from '@cardstack/cardpay-sdk';

import {
  PayMerchantDecodedData,
  TransactionConfirmationType,
} from '@cardstack/types';

import { BaseStrategyWithActionDispatcherData } from './base-strategy';
import { decodeParameters } from './decoding-utils';

export class PayMerchantStrategy extends BaseStrategyWithActionDispatcherData {
  isApplicable(): boolean {
    return this.actionDispatcherData.actionName === 'payMerchant';
  }

  public async decodeRequest(): Promise<PayMerchantDecodedData> {
    const { merchantSafe } = decodeParameters<{
      merchantSafe: string;
    }>(
      [
        {
          type: 'address',
          name: 'merchantSafe',
        },
      ],
      this.actionDispatcherData.actionData
    );

    const safeData = (await this.getSafeData(merchantSafe)) as MerchantSafe;

    return {
      amount: this.actionDispatcherData.spendAmount.toString(),
      spendAmount: this.actionDispatcherData.spendAmount,
      merchantSafe,
      infoDID: safeData.infoDID,
      prepaidCard: this.verifyingContract,
      type: TransactionConfirmationType.PAY_MERCHANT,
    };
  }
}
