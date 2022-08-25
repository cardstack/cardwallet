import { NativeCurrency } from '@cardstack/cardpay-sdk';
import { createApi } from '@reduxjs/toolkit/query/react';

import { transformObjKeysToCamelCase } from '@cardstack/utils';

import { queryPromiseWrapper } from '../utils';

import { checkHubAuth, fetchHubBaseQuery, hubBodyBuilder } from './hub-service';
import {
  RequestCardDropQueryParams,
  EoaClaimedAttrsType,
  GetEoaClaimedQueryParams,
  GetEoaClaimedQueryResult,
  CheckHubAuthQueryParams,
  RegisterFCMTokenQueryParams,
  GetExchangeRatesQueryParams,
} from './hub-types';

const routes = {
  emailDrop: '/email-card-drop-requests',
  exchangeRates: '/exchange-rates',
  registerFCMToken: '/push-notification-registrations',
};

enum CacheTag {
  EOA_CLAIM = 'EOA_CLAIM',
}

export const hubApi = createApi({
  reducerPath: 'hubApi',
  baseQuery: fetchHubBaseQuery,
  tagTypes: [...Object.values(CacheTag)],
  endpoints: builder => ({
    requestEmailCardDrop: builder.mutation<void, RequestCardDropQueryParams>({
      query: ({ email }) => ({
        url: routes.emailDrop,
        method: 'POST',
        body: hubBodyBuilder(routes.emailDrop, {
          email,
        }),
      }),
      invalidatesTags: [CacheTag.EOA_CLAIM],
    }),
    getEoaClaimed: builder.query<
      GetEoaClaimedQueryResult,
      GetEoaClaimedQueryParams
    >({
      query: ({ eoa }) => `${routes.emailDrop}?eoa=${eoa}`,
      extraOptions: { authenticate: false },
      transformResponse: (response: {
        data: { attributes: EoaClaimedAttrsType };
      }) => transformObjKeysToCamelCase(response?.data?.attributes),
      providesTags: [CacheTag.EOA_CLAIM],
    }),
    checkHubAuth: builder.query<boolean, CheckHubAuthQueryParams>({
      async queryFn(params) {
        return queryPromiseWrapper<boolean, CheckHubAuthQueryParams>(
          checkHubAuth,
          params,
          {
            errorLogMessage: 'Error checking hub auth',
          }
        );
      },
    }),
    getExchangeRates: builder.query<
      Record<NativeCurrency | string, number>,
      GetExchangeRatesQueryParams | void
    >({
      query: (params?: GetExchangeRatesQueryParams) => ({
        url: routes.exchangeRates,
        params,
      }),
      transformResponse: ({ data }) => data.attributes.rates,
    }),
    registerFcmToken: builder.query<string, RegisterFCMTokenQueryParams>({
      query: ({ fcmToken }) => ({
        url: routes.registerFCMToken,
        method: 'POST',
        body: hubBodyBuilder('push-notification-registration', {
          'push-client-id': fcmToken,
        }),
      }),
    }),
    unregisterFcmToken: builder.mutation<string, RegisterFCMTokenQueryParams>({
      query: ({ fcmToken }) => ({
        url: `${routes.registerFCMToken}/${fcmToken}`,
        method: 'DELETE',
        responseHandler: response => response.text(),
      }),
    }),
  }),
});

export const {
  useGetEoaClaimedQuery,
  useRequestEmailCardDropMutation,
  useCheckHubAuthQuery,
  useGetExchangeRatesQuery,
  useRegisterFcmTokenQuery,
  useUnregisterFcmTokenMutation,
} = hubApi;
