import { NativeCurrency } from '@cardstack/cardpay-sdk';
import { Dictionary, EntityId } from '@reduxjs/toolkit';

import { NetworkType, Asset, BalanceType } from '@cardstack/types';

export interface EOABaseParams {
  network: NetworkType;
  accountAddress: string;
  nativeCurrency: NativeCurrency;
}

export type AssetsDictionary = Dictionary<Asset>;
export interface GetAssetsResult {
  assets: AssetsDictionary;
  ids: EntityId[];
}

export type GetTokensBalanceParams = Pick<GetAssetsResult, 'assets'> &
  Omit<EOABaseParams, 'nativeCurrency'>;

export type GetTokensBalanceResult = { [key: string]: BalanceType };

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
