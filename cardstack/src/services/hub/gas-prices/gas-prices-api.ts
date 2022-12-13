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

        return {
          fast,
          slow,
          standard,
        };
      },
    }),
  }),
});

export const { useGetGasPricesQuery } = hubGasPrices;
