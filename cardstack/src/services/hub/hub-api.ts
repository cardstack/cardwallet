import { createApi } from '@reduxjs/toolkit/query/react';

import { CustodialWallet } from '@cardstack/types';
import { transformObjKeysToCamelCase } from '@cardstack/utils';

import { fetchHubBaseQuery, hubBodyBuilder } from './hub-service';
import {
  GetCustodialWalletQueryResult,
  RequestCardDropQueryParams,
  EoaClaimedArg,
  EoaClaimedResultType,
} from './hub-types';

const routes = {
  custodialWallet: '/api/custodial-wallet',
  emailDrop: '/email-card-drop-requests',
  emailCardDropRequest: ({ eoa }: EoaClaimedArg) =>
    `/email-card-drop-requests?eoa=${eoa}`,
};

export const hubApi = createApi({
  reducerPath: 'hubApi',
  baseQuery: fetchHubBaseQuery,
  endpoints: builder => ({
    getCustodialWallet: builder.query<GetCustodialWalletQueryResult, void>({
      query: () => routes.custodialWallet,
      extraOptions: { authenticate: true },
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
        extraOptions: { authenticate: true },
        method: 'POST',
        body: hubBodyBuilder(routes.emailDrop, {
          email,
        }),
      }),
    }),
    getEoaClaimed: builder.query<EoaClaimedResultType, EoaClaimedArg>({
      query: routes.emailCardDropRequest,
      extraOptions: { authenticate: false },
      transformResponse: (response: {
        data: { attributes: { claimed: EoaClaimedResultType } };
      }) => response?.data?.attributes?.claimed,
    }),
  }),
});

export const {
  useGetCustodialWalletQuery,
  useGetEoaClaimedQuery,
  useRequestEmailCardDropMutation,
} = hubApi;
