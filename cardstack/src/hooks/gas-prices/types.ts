export interface ParseTxFeeParams {
  gasLimit?: string;
}

export type TxFee = Record<
  string,
  {
    native: { amount: string; display: string };
    value: { amount: string; display: string };
  }
>;
