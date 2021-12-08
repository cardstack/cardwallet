import assert from 'assert';
import { TransferPrepaidCard2DecodedData } from '../types/transaction-confirmation-types';
import { BaseStrategyWithActionDispatcherData } from './base-strategy';
import { decodeParameters } from './decoding-utils';
import { TransactionConfirmationType } from '@cardstack/types';

export class TransferPrepaidCard2Strategy extends BaseStrategyWithActionDispatcherData {
  isApplicable(): boolean {
    return (
      !!this.verifyingContract &&
      this.actionDispatcherData.actionName === 'transfer'
    );
  }

  public decodeRequest(): TransferPrepaidCard2DecodedData {
    assert(typeof this.verifyingContract === 'string');

    const { newOwner } = decodeParameters<{
      newOwner: string;
      signature: string;
    }>(
      [
        { type: 'address', name: 'newOwner' },
        { type: 'bytes', name: 'signature' },
      ],
      this.actionDispatcherData.actionData
    );

    return {
      newOwner,
      prepaidCard: this.verifyingContract,
      type: TransactionConfirmationType.TRANSFER_PREPAID_CARD_2,
    };
  }
}
