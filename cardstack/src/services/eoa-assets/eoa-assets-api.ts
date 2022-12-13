import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query';

import { queryPromiseWrapper } from '../utils';

import { getAccountAssets } from './eoa-assets-services';

const eoaAssetsApi = createApi({
  reducerPath: 'eoaAssets',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: builder => ({
    getEOAAssets: builder.query<any, any>({
      async queryFn(params) {
        return queryPromiseWrapper<any, any>(getAccountAssets, params, {
          errorLogMessage: 'Error fetching eoa assets',
        });
      },
    }),
  }),
});

export const {} = eoaAssetsApi;
