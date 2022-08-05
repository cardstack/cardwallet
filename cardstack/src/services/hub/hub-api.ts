import { NativeCurrency } from '@cardstack/cardpay-sdk';
import { createApi } from '@reduxjs/toolkit/query/react';

import { CustodialWallet, ProfileIDUniquenessResponse } from '@cardstack/types';
import { transformObjKeysToCamelCase } from '@cardstack/utils';

import { CacheTags as SafeCacheTags } from '../safes-api';
import { queryPromiseWrapper } from '../utils';

import {
  checkHubAuth,
  fetchHubBaseQuery,
  hubBodyBuilder,
  hubProfilePurchaseBody,
} from './hub-service';
import {
  GetCustodialWalletQueryResult,
  RequestCardDropQueryParams,
  EoaClaimedAttrsType,
  GetEoaClaimedQueryParams,
  GetEoaClaimedQueryResult,
  CheckHubAuthQueryParams,
  RegisterFCMTokenQueryParams,
  GetExchangeRatesQueryParams,
  PostProfilePurchaseQueryParams,
  GetValidateProfileSlugParams,
  CreateProfileInfoParams,
  PostProfilePurchaseQueryResult,
} from './hub-types';

const routes = {
  custodialWallet: '/custodial-wallet',
  emailDrop: '/email-card-drop-requests',
  exchangeRates: '/exchange-rates',
  registerFCMToken: '/push-notification-registrations',
  profilePurchases: '/profile-purchases',
  profileInfo: {
    root: '/merchant-infos',
    validateSlug: '/validate-slug',
    jobTicket: '/job-tickets',
  },
};

enum CacheTag {
  EOA_CLAIM = 'EOA_CLAIM',
}

export const hubApi = createApi({
  reducerPath: 'hubApi',
  baseQuery: fetchHubBaseQuery,
  tagTypes: [...Object.values(CacheTag), ...Object.values(SafeCacheTags)],
  endpoints: builder => ({
    getCustodialWallet: builder.query<GetCustodialWalletQueryResult, void>({
      query: () => routes.custodialWallet,
      transformResponse: (response: { data: CustodialWallet }) =>
        transformObjKeysToCamelCase(response?.data?.attributes),
    }),
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
    profilePurchases: builder.mutation<
      PostProfilePurchaseQueryResult,
      PostProfilePurchaseQueryParams
    >({
      query: params => ({
        url: routes.profilePurchases,
        method: 'POST',
        body: hubProfilePurchaseBody(routes.profilePurchases, params),
      }),
    }),
    validateProfileSlug: builder.query<
      ProfileIDUniquenessResponse,
      GetValidateProfileSlugParams
    >({
      query: ({ slug }) =>
        `${routes.profileInfo.root}${routes.profileInfo.validateSlug}/${slug}`,
    }),
    createProfileInfo: builder.mutation<string, CreateProfileInfoParams>({
      query: params => ({
        url: routes.profileInfo.root,
        method: 'POST',
        body: hubBodyBuilder(routes.profileInfo.root, params),
      }),
      transformResponse: ({ data }) => data?.attributes?.did,
    }),
    createProfileJob: builder.query<string, { eoa: string }>({
      query: ({ eoa }) => `${routes.profileInfo.jobTicket}?eoa=${eoa}`,
      transformResponse: ({ data }) =>
        data.find((job: any) => job.attributes?.state === 'success'),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data: profileId } = await queryFulfilled;

        if (profileId) {
          // TODO: Investigate cache invalidation configurations.
          // This only invalidates cached results but doesn't automatically
          // makes a new query, as it should per documented here:
          // https://redux-toolkit.js.org/rtk-query/usage/automated-refetching
          dispatch(hubApi.util.invalidateTags([SafeCacheTags.SAFES]));
        }
      },
    }),
  }),
});

export const {
  useGetCustodialWalletQuery,
  useGetEoaClaimedQuery,
  useRequestEmailCardDropMutation,
  useCheckHubAuthQuery,
  useGetExchangeRatesQuery,
  useRegisterFcmTokenQuery,
  useUnregisterFcmTokenMutation,
  useProfilePurchasesMutation,
  useLazyValidateProfileSlugQuery,
  useCreateProfileInfoMutation,
  useLazyCreateProfileJobQuery,
} = hubApi;
