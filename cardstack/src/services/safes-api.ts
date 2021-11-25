import { NativeCurrency } from '@cardstack/cardpay-sdk/sdk/currencies';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { fetchSafes } from './gnosis-service';

export enum CacheTags {
  SAFES = 'SAFES',
}

export const safesApi = createApi({
  reducerPath: 'safesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: [CacheTags.SAFES],
  endpoints: builder => ({
    // TODO: Add right return type
    getSafesData: builder.query<
      any,
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