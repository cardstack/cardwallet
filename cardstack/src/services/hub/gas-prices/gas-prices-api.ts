import { BigNumberish, utils } from 'ethers';

import { hubApi } from '../hub-api';

import {
  GasPricesAttrsType,
  GasPricesQueryParams,
  GasPricesQueryResults,
} from './gas-prices-types';

const routes = {
  gasPrices: '/gas-station',
};

export const hubGasPrices = hubApi.injectEndpoints({
  endpoints: builder => ({
    getGasPrices: builder.query<GasPricesQueryResults, GasPricesQueryParams>({
      query: ({ chainId }) => ({
        url: `${routes.gasPrices}/${chainId}`,
        method: 'GET',
      }),
      transformResponse: (response: {
        data: { attributes: GasPricesAttrsType };
      }) => {
        // we don't need the chain-id that comes from the response
        const { fast, slow, standard } = response.data.attributes;

        const gasPriceFormatter = (value: BigNumberish) => ({
          amount: value,
          display: `${utils.formatUnits(value, 'gwei')} Gwei`,
        });

        return {
          fast: gasPriceFormatter(fast),
          slow: gasPriceFormatter(slow),
          standard: gasPriceFormatter(standard),
        };
      },
    }),
  }),
});

export const { useGetGasPricesQuery } = hubGasPrices;
