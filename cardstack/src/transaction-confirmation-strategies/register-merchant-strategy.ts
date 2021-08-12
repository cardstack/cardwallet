import { BaseStrategyWithActionDispatcherData } from './base-strategy';
import { decodeParameters } from './decoding-utils';
import {
  RegisterMerchantDecodedData,
  TransactionConfirmationType,
} from '@cardstack/types';

export class RegisterMerchantStrategy extends BaseStrategyWithActionDispatcherData {
  isApplicable(): boolean {
    return this.actionDispatcherData.actionName === 'registerMerchant';
  }

  public decodeRequest(): RegisterMerchantDecodedData {
    const { infoDID } = decodeParameters<{ infoDID: string }>(
      [
        {
          type: 'string',
          name: 'infoDID',
        },
      ],
      this.actionDispatcherData.actionData
    );

    return {
      spendAmount: this.actionDispatcherData.spendAmount,
      infoDID,
      prepaidCard: this.verifyingContract,
      type: TransactionConfirmationType.REGISTER_MERCHANT,
    };
  }
}
