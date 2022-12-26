import { NativeCurrency } from '@cardstack/cardpay-sdk';
import { createEntityAdapter } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { AssetType } from '@cardstack/types';

import { queryPromiseWrapper } from '../utils';

import { Price } from './coingecko/coingecko-types';
import {
  getAccountAssets,
  getCardPayTokensPrice,
  getTokensBalances,
} from './eoa-assets-services';
import {
  EOABaseParams,
  GetAssetsResult,
  GetTokensBalanceParams,
  GetTokensBalanceResult,
} from './eoa-assets-types';

const assetsAdapter = createEntityAdapter<AssetType>();

export const eoaAssetsApi = createApi({
  reducerPath: 'eoaAssetsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: [],
  endpoints: builder => ({
    getEOAAssets: builder.query<GetAssetsResult, EOABaseParams>({
      async queryFn(params) {
        const response = await queryPromiseWrapper<AssetType[], EOABaseParams>(
          getAccountAssets,
          params,
          {
            errorLogMessage: 'Error fetching eoa assets',
          }
        );

        // Normalize data
        if (response.data) {
          const { entities: assets, ids } = assetsAdapter.addMany(
            assetsAdapter.getInitialState(),
            response.data
          );

          return {
            data: { assets, ids },
          };
        }

        return response;
      },
    }),
    getCardPayTokensPrices: builder.query<
      Price,
      { nativeCurrency: NativeCurrency }
    >({
      async queryFn(params) {
        return queryPromiseWrapper<Price, { nativeCurrency: NativeCurrency }>(
          getCardPayTokensPrice,
          params,
          {
            errorLogMessage: 'Error getCardPayTokensPrice',
          }
        );
      },
    }),
    getOnChainTokenBalances: builder.query<
      GetTokensBalanceResult,
      GetTokensBalanceParams
    >({
      async queryFn(params) {
        return queryPromiseWrapper<
          GetTokensBalanceResult,
          GetTokensBalanceParams
        >(getTokensBalances, params, {
          errorLogMessage: 'Error getTokensBalances',
        });
      },
    }),
  }),
});

export const {
  useGetEOAAssetsQuery,
  useGetCardPayTokensPricesQuery,
  useGetOnChainTokenBalancesQuery,
} = eoaAssetsApi;
