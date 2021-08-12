import Web3 from 'web3';
import { TransferPrepaidCard1DecodedData } from '../types/transaction-confirmation-types';
import { BaseStrategy } from './base-strategy';
import { decodeParameters } from './decoding-utils';
import { TransactionConfirmationType } from '@cardstack/types';

export class TransferPrepaidCard1Strategy extends BaseStrategy {
  isApplicable(): boolean {
    const web3 = new Web3();

    const transferPrefix = web3.eth.abi.encodeFunctionSignature(
      'swapOwner(address,address,address)'
    );

    return this.message.data?.slice(0, 10) === transferPrefix;
  }

  public async decodeRequest(): Promise<TransferPrepaidCard1DecodedData> {
    const data = this.message.data?.slice(10) || '';

    const { newOwner, oldOwner } = decodeParameters<{
      newOwner: string;
      oldOwner: string;
      prepaidCard: string;
    }>(
      [
        { type: 'address', name: 'prepaidCard' },
        { type: 'address', name: 'oldOwner' },
        { type: 'address', name: 'newOwner' },
      ],
      data
    );

    return {
      newOwner,
      oldOwner,
      prepaidCard: this.verifyingContract,
      type: TransactionConfirmationType.TRANSFER_PREPAID_CARD_1,
    };
  }
}
