import { transformObjKeysToCamelCase } from '@cardstack/utils';

import { defaultGasPriceFormat } from '@rainbow-me/parsers';
import { gasUtils } from '@rainbow-me/utils';

import { hubApi } from '../hub-api';

const { CUSTOM, NORMAL, FAST, SLOW } = gasUtils;

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
        const attributes = transformObjKeysToCamelCase(
          response.data.attributes
        );

        return {
          [CUSTOM]: null,
          [FAST]: defaultGasPriceFormat(FAST, null, attributes.fast),
          [NORMAL]: defaultGasPriceFormat(NORMAL, null, attributes.standard),
          [SLOW]: defaultGasPriceFormat(SLOW, null, attributes.slow),
        };
      },
    }),
  }),
});

export const { useGetGasPricesQuery } = hubGasPrices;
