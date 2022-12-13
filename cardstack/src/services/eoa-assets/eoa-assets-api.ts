import { createEntityAdapter, Dictionary, EntityId } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { AssetTypes } from '@cardstack/types';

import { queryPromiseWrapper } from '../utils';

import { getAccountAssets } from './eoa-assets-services';

export interface Asset {
  id: string;
  address: string;
  tokenID?: string;
  name: string;
  symbol: string;
  decimals: number;
  type: AssetTypes;
}

const assetsAdapter = createEntityAdapter<Asset>();

interface Response {
  assets: Dictionary<Asset>;
  ids: EntityId[];
}

export const eoaAssetsApi = createApi({
  reducerPath: 'eoaAssetsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: [],
  endpoints: builder => ({
    getEOAAssets: builder.query<Response, any>({
      async queryFn(params) {
        const response = await queryPromiseWrapper<Asset[], any>(
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
  }),
});

export const { useGetEOAAssetsQuery } = eoaAssetsApi;
