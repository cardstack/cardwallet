import { BigNumberish } from 'ethers';

export type GasPricesQueryParams = {
  chainId: number;
};

export type GasPricesAttrsType = {
  'chain-id': string;
  slow: string;
  standard: string;
  fast: string;
};

export type GasPricesQueryResults = Record<
  keyof Omit<GasPricesAttrsType, 'chain-id'>,
  BigNumberish
>;
