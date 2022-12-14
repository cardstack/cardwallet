import { NativeCurrency } from '@cardstack/cardpay-sdk';
import { createApi } from '@reduxjs/toolkit/query/react';

import { transformObjKeysToCamelCase } from '@cardstack/utils';

import { fetchHubBaseQuery, hubBodyBuilder } from './hub-service';
import {
  RequestCardDropQueryParams,
  EoaClaimedAttrsType,
  GetEoaClaimedQueryParams,
  GetEoaClaimedQueryResult,
  GetExchangeRatesQueryParams,
} from './hub-types';

const routes = {
  emailDrop: '/email-card-drop-requests',
  exchangeRates: '/exchange-rates',
};

export enum HubCacheTags {
  EOA_CLAIM = 'EOA_CLAIM',
  NOTIFICATION_PREFERENCES = 'NOTIFICATION_PREFERENCES',
}

export const hubApi = createApi({
  reducerPath: 'hubApi',
  baseQuery: fetchHubBaseQuery,
  tagTypes: [...Object.values(HubCacheTags)],
  endpoints: builder => ({
    requestEmailCardDrop: builder.mutation<void, RequestCardDropQueryParams>({
      query: ({ email }) => ({
        url: routes.emailDrop,
        method: 'POST',
        body: hubBodyBuilder(routes.emailDrop, {
          email,
        }),
      }),
      invalidatesTags: [HubCacheTags.EOA_CLAIM],
    }),
    getEoaClaimed: builder.query<
      GetEoaClaimedQueryResult,
      GetEoaClaimedQueryParams
    >({
      query: ({ eoa }) => `${routes.emailDrop}?eoa=${eoa}`,
      extraOptions: { authenticate: false },
      transformResponse: (response: {
        data: { attributes: EoaClaimedAttrsType };
      }) => transformObjKeysToCamelCase(response?.data?.attributes),
      providesTags: [HubCacheTags.EOA_CLAIM],
    }),
    getExchangeRates: builder.query<
      Record<NativeCurrency | string, number>,
      GetExchangeRatesQueryParams | void
    >({
      query: (params?: GetExchangeRatesQueryParams) => ({
        url: routes.exchangeRates,
        params,
      }),
      transformResponse: ({ data }) => data.attributes.rates,
    }),
  }),
});

export const {
  useGetEoaClaimedQuery,
  useRequestEmailCardDropMutation,
  useGetExchangeRatesQuery,
} = hubApi;
