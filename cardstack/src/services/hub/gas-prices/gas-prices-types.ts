export type GasPricesQueryParams = {
  chainId: number;
};

export type GasPricesAttrsType = {
  'chain-id': string;
  slow: string;
  standard: string;
  fast: string;
};

export type GasPricesQueryResults = Omit<GasPricesAttrsType, 'chain-id'>;
