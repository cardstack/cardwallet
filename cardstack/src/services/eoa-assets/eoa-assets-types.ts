import { NativeCurrency } from '@cardstack/cardpay-sdk';

import { NetworkType } from '@cardstack/types';

export interface EOABaseParams {
  network: NetworkType;
  accountAddress: string;
  nativeCurrency: NativeCurrency;
}

export type EOATxListResponse = Array<
  Record<
    | 'blockHash'
    | 'blockNumber'
    | 'confirmations'
    | 'contractAddress'
    | 'cumulativeGasUsed'
    | 'from'
    | 'gas'
    | 'gasPrice'
    | 'gasUsed'
    | 'hash'
    | 'input'
    | 'logIndex'
    | 'nonce'
    | 'timeStamp'
    | 'to'
    | 'tokenDecimal'
    | 'tokenName'
    | 'tokenSymbol'
    | 'transactionIndex',
    string
  > & {
    tokenID?: string;
  }
>;
