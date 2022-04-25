import { createApi } from '@reduxjs/toolkit/query/react';

import { CustodialWallet } from '@cardstack/types';
import { transformObjKeysToCamelCase } from '@cardstack/utils';

import { fetchHubBaseQuery } from './hub-service';
import { GetCustodialWalletQueryResult } from './hub-types';

const routes = {
  custodialWallet: '/api/custodial-wallet',
};

export const hubApi = createApi({
  reducerPath: 'hubApi',
  baseQuery: fetchHubBaseQuery,
  endpoints: builder => ({
    getCustodialWallet: builder.query<GetCustodialWalletQueryResult, void>({
      query: () => routes.custodialWallet,
      transformResponse: (response: { data: CustodialWallet }) => {
        const attributes = transformObjKeysToCamelCase(
          response?.data?.attributes
        );

        return attributes;
      },
    }),
  }),
});

export const { useGetCustodialWalletQuery } = hubApi;
