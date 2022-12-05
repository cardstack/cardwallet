import { defaultGasPriceFormat } from '@rainbow-me/parsers';

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
  string,
  ReturnType<typeof defaultGasPriceFormat> | null
>;
