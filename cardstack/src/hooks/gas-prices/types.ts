import { BalanceType } from '@cardstack/types';

export interface ParseTxFeeParams {
  gasLimit?: string;
}

export interface TxFeeValue {
  native: BalanceType;
  value: BalanceType;
}

export type TxFee = Record<string, TxFeeValue>;
