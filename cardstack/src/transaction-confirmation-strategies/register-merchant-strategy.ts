import assert from 'assert';

import {
  RegisterMerchantDecodedData,
  TransactionConfirmationType,
} from '@cardstack/types';

import { BaseStrategyWithActionDispatcherData } from './base-strategy';
import { decodeParameters } from './decoding-utils';

export class RegisterMerchantStrategy extends BaseStrategyWithActionDispatcherData {
  isApplicable(): boolean {
    return (
      !!this.verifyingContract &&
      this.actionDispatcherData.actionName === 'registerMerchant'
    );
  }

  public decodeRequest(): RegisterMerchantDecodedData {
    assert(typeof this.verifyingContract === 'string');

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
