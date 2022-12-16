import { NetworkType } from '@cardstack/types';

export interface UseGasParams {
  network: NetworkType;
}

export interface ParseTxFeeParams {
  nativeTokenPriceUnit?: number;
  gasLimit?: number;
}

export type TxFee = Record<
  string,
  {
    native: { amount: string; display: string };
    value: { amount: string; display: string };
  }
>;
