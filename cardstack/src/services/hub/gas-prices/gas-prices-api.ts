import { transformObjKeysToCamelCase } from '@cardstack/utils';

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
        transformResponse: (response: {
          data: { attributes: GasPricesAttrsType };
        }) => transformObjKeysToCamelCase(response?.data?.attributes),
      }),
    }),
  }),
});

export const { useGetGasPricesQuery } = hubGasPrices;
