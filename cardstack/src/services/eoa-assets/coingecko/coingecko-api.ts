import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getCoingeckoPlatformName } from './coingecko-services';

export const coingeckoApi = createApi({
  reducerPath: 'coingeckoApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.coingecko.com/api/v3/simple',
  }),
  tagTypes: [],
  endpoints: builder => ({
    getAssetsPriceByContract: builder.query<any, any>({
      query: ({ network, nativeCurrency, addresses }) => {
        const platform = getCoingeckoPlatformName(network);
        const contratAddressQuery = addresses.filter(Boolean).join(',');

        return `/token_price/${platform}?contract_addresses=${contratAddressQuery}&vs_currencies=${nativeCurrency}`;
      },
    }),
    getAssetsPriceById: builder.query({
      query: ({ id, nativeCurrency }) =>
        `/price?ids=${id}&vs_currencies=${nativeCurrency}&include_24hr_change=true&include_last_updated_at=true`,
      transformResponse: response => {
        console.log(response);

        return response;
      },
    }),
  }),
});

export const {
  useGetAssetsPriceByContractQuery,
  useGetAssetsPriceByIdQuery,
} = coingeckoApi;
