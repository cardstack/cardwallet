import { NativeCurrency } from '@cardstack/cardpay-sdk';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { DepotType, MerchantSafeType, PrepaidCardType } from '@cardstack/types';

import { fetchSafes } from './gnosis-service';

export enum CacheTags {
  SAFES = 'SAFES',
  PREPAID_CARDS = 'PREPAID_CARDS',
  REWARDS_SAFE = 'REWARDS_SAFE',
  REWARDS_POOL = 'REWARDS_POOL',
}

interface GetSafesQueryResult {
  prepaidCards?: PrepaidCardType[];
  depots?: DepotType[];
  merchantSafes?: MerchantSafeType[];
  timestamp: string;
}

export const safesApi = createApi({
  reducerPath: 'safesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: [...Object.values(CacheTags)],
  endpoints: builder => ({
    getSafesData: builder.query<
      GetSafesQueryResult,
      { address: string; nativeCurrency: NativeCurrency }
    >({
      async queryFn({ address, nativeCurrency = NativeCurrency.USD }) {
        return await fetchSafes(address, nativeCurrency);
      },
      providesTags: [CacheTags.SAFES],
    }),
  }),
});

export const { useGetSafesDataQuery } = safesApi;
