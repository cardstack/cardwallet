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
        const contracts = addresses.filter(Boolean).join(',');

        return `/token_price/${platform}?contract_addresses=${contracts}&vs_currencies=${nativeCurrency}`;
      },
      // Map from { [address]:{ [currency]: 0.0303 }} => { [address]: 0.0303 }
      transformResponse: (
        response: CoingeckoPriceResponse,
        _,
        { nativeCurrency }
      ) =>
        Object.entries(response).reduce(
          (prices, [address, price]) => ({
            ...prices,
            [address]: price[nativeCurrency.toLowerCase()],
          }),
          {}
        ),
    }),
    getNativeTokensPrice: builder.query<Price, GetNativeTokensPricesParams>({
      query: ({ network, nativeCurrency }) => {
        const id = getConstantByNetwork('nativeTokenCoingeckoId', network);

        return `/price?ids=${id}&vs_currencies=${nativeCurrency}`;
      },
      // Map from { [coingeckoID]: { [currency]: 0.0303 }} => { [address]: 0.0303 } }
      transformResponse: (
        response: CoingeckoPriceResponse,
        _,
        { nativeCurrency, network }
      ) => {
        const address = getConstantByNetwork('nativeTokenAddress', network);
        const id = getConstantByNetwork('nativeTokenCoingeckoId', network);

        return {
          [address]: response[id][nativeCurrency.toLowerCase()],
        };
      },
    }),
  }),
});

export const {
  useGetAssetsPriceByContractQuery,
  useGetNativeTokensPriceQuery,
} = coingeckoApi;
