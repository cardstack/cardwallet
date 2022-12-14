import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getCoingeckoPlatformName } from './coingecko-services';
import {
  CoingeckoPriceResponse,
  GetNativeTokensPricesParams,
  GetPricesByContractParams,
  Price,
} from './coingecko-types';

export const coingeckoApi = createApi({
  reducerPath: 'coingeckoApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.coingecko.com/api/v3/simple',
  }),
  tagTypes: [],
  endpoints: builder => ({
    getAssetsPriceByContract: builder.query<Price, GetPricesByContractParams>({
      query: ({ network, nativeCurrency, addresses = [] }) => {
        const platform = getCoingeckoPlatformName(network);
        const contratAddressQuery = addresses.filter(Boolean).join(',');

        return `/token_price/${platform}?contract_addresses=${contratAddressQuery}&vs_currencies=${nativeCurrency}`;
      },
      transformResponse: (
        { data }: { data: CoingeckoPriceResponse },
        _,
        { nativeCurrency }
      ) =>
        // Map from { [address]:{ [currency]: 0.0303 }} => { [address]: 0.0303 }
        Object.entries(data).reduce(
          (prices, [address, price]) => ({
            ...prices,
            [address]: price[nativeCurrency],
          }),
          {}
        ),
    }),
    getNativeTokensPrice: builder.query<Price, GetNativeTokensPricesParams>({
      query: ({ network, nativeCurrency }) => {
        const id = getConstantByNetwork('nativeTokenCoingeckoId', network);

        return `/price?ids=${id}&vs_currencies=${nativeCurrency}&include_24hr_change=true&include_last_updated_at=true`;
      },

      transformResponse: (
        { data }: { data: CoingeckoPriceResponse },
        _,
        { nativeCurrency, network }
      ) => {
        // Map from { [coingeckoID]: { [currency]: 0.0303 }} => { [address]: 0.0303 } }

        const address = getConstantByNetwork('nativeTokenAddress', network);
        const id = getConstantByNetwork('nativeTokenCoingeckoId', network);

        return {
          [address]: data[id][nativeCurrency],
        };
      },
    }),
  }),
});

export const {
  useGetAssetsPriceByContractQuery,
  useGetNativeTokensPriceQuery,
} = coingeckoApi;
