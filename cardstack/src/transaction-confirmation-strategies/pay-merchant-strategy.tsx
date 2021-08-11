import { BaseStrategyWithActionDispatcherData } from './base-strategy';
import { decodeParameters } from './decoding-utils';
import {
  PayMerchantDecodedData,
  TransactionConfirmationType,
} from '@cardstack/types';

export class PayMerchantStrategy extends BaseStrategyWithActionDispatcherData {
  isApplicable(): boolean {
    return this.actionDispatcherData.actionName === 'payMerchant';
  }

  public decodeRequest(): PayMerchantDecodedData {
    const { merchantSafe } = decodeParameters<{ merchantSafe: string }>(
      [
        {
          type: 'address',
          name: 'merchantSafe',
        },
      ],
      this.actionDispatcherData.actionData
    );

    return {
      spendAmount: this.actionDispatcherData.spendAmount,
      merchantSafe,
      prepaidCard: this.verifyingContract,
      type: TransactionConfirmationType.PAY_MERCHANT,
    };
  }
}
