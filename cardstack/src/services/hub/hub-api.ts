import { createApi } from '@reduxjs/toolkit/query/react';

import { CustodialWallet } from '@cardstack/types';
import { transformObjKeysToCamelCase } from '@cardstack/utils';

import { fetchHubBaseQuery, hubBodyBuilder } from './hub-service';
import {
  GetCustodialWalletQueryResult,
  RequestCardDropQueryParams,
  GetEoaClaimedQueryParams,
  GetEoaClaimedResultType,
} from './hub-types';

const routes = {
  custodialWallet: '/custodial-wallet',
  emailDrop: '/email-card-drop-requests',
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
    requestEmailCardDrop: builder.mutation<void, RequestCardDropQueryParams>({
      query: ({ email }) => ({
        url: routes.emailDrop,
        method: 'POST',
        body: hubBodyBuilder(routes.emailDrop, {
          email,
        }),
      }),
    }),
    getEoaClaimed: builder.query<
      GetEoaClaimedResultType,
      GetEoaClaimedQueryParams
    >({
      query: ({ eoa }) => `${routes.emailDrop}?eoa=${eoa}`,
      extraOptions: { authenticate: false },
      transformResponse: (response: {
        data: { attributes: { claimed: GetEoaClaimedResultType } };
      }) => response?.data?.attributes?.claimed,
    }),
  }),
});

export const {
  useGetCustodialWalletQuery,
  useGetEoaClaimedQuery,
  useRequestEmailCardDropMutation,
} = hubApi;
