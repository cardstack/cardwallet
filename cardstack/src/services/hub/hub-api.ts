import { NativeCurrency } from '@cardstack/cardpay-sdk';
import { createApi } from '@reduxjs/toolkit/query/react';

import { CustodialWallet, ProfileIDUniquenessResponse } from '@cardstack/types';
import { transformObjKeysToCamelCase } from '@cardstack/utils';

import { queryPromiseWrapper } from '../utils';

import {
  checkHubAuth,
  fetchHubBaseQuery,
  hubBodyBuilder,
  hubProfilePurchaseBody,
  patchProfileInfo,
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
  JobTicketResult,
  UpdateProfileInfoParams,
} from './hub-types';

const routes = {
  custodialWallet: '/custodial-wallet',
  emailDrop: '/email-card-drop-requests',
  exchangeRates: '/exchange-rates',
  registerFCMToken: '/push-notification-registrations',
  profilePurchases: '/profile-purchases',
  profileInfo: {
    root: '/profiles',
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
  tagTypes: [...Object.values(CacheTag)],
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
    profilePurchases: builder.mutation<string, PostProfilePurchaseQueryParams>({
      query: params => ({
        url: routes.profilePurchases,
        method: 'POST',
        body: hubProfilePurchaseBody(routes.profilePurchases, params),
      }),
      transformResponse: (result: PostProfilePurchaseQueryResult) =>
        result?.included?.[0].id,
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
    updateProfileInfo: builder.mutation<string, UpdateProfileInfoParams>({
      query: params => ({
        url: `${routes.profileInfo.root}/${params.id}`,
        method: 'PATCH',
        body: hubBodyBuilder(routes.profileInfo.root, params),
      }),
      async onQueryStarted(params, { queryFulfilled }) {
        const updatedResult = patchProfileInfo(params);

        queryFulfilled.catch(updatedResult.undo);
      },
    }),
    getProfileJobStatus: builder.query<
      JobTicketResult,
      { jobTicketID: string }
    >({
      query: ({ jobTicketID }) =>
        `${routes.profileInfo.jobTicket}/${jobTicketID}`,
      transformResponse: ({ data }) => data,
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
  useGetProfileJobStatusQuery,
  useUpdateProfileInfoMutation,
} = hubApi;
