import { ProfileIDUniquenessResponse } from '@cardstack/types';

import { CacheTags as SafesCacheTags, safesApi } from '../../safes-api';
import { hubApi } from '../hub-api';
import {
  hubBodyBuilder,
  hubProfilePurchaseBody,
  patchProfileInfo,
} from '../hub-service';
import {
  PostProfilePurchaseQueryParams,
  GetValidateProfileSlugParams,
  CreateProfileInfoParams,
  PostProfilePurchaseQueryResult,
  UpdateProfileInfoParams,
  JobTicketTypeResult,
  JobStateType,
} from '../hub-types';

const routes = {
  profilePurchases: '/profile-purchases',
  profileInfo: {
    root: '/profiles',
    validateSlug: '/validate-slug',
    jobTicket: '/job-tickets',
  },
};

export const hubProfile = hubApi.injectEndpoints({
  endpoints: builder => ({
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
    getProfileJobStatus: builder.query<JobStateType, { jobTicketID: string }>({
      query: ({ jobTicketID }) =>
        `${routes.profileInfo.jobTicket}/${jobTicketID}`,
      transformResponse: ({ data }: { data: JobTicketTypeResult }) =>
        data.attributes?.state,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: status } = await queryFulfilled;

          if (status === 'success') {
            dispatch(safesApi.util.invalidateTags([SafesCacheTags.SAFES]));
          }
        } catch {}
      },
    }),
    postProfileJobRetry: builder.mutation<unknown, { jobTicketID: string }>({
      query: ({ jobTicketID }) => ({
        url: `${routes.profileInfo.jobTicket}/${jobTicketID}/retry`,
        method: 'POST',
      }),
    }),
    getProfileUnfulfilledJob: builder.query<string | undefined, void>({
      query: () => `${routes.profileInfo.jobTicket}`,
      transformResponse: ({ data }: { data: JobTicketTypeResult[] }) => {
        const unfulfilledJob = data.find(
          ({ attributes }) =>
            attributes['job-type'] === 'create-profile' &&
            attributes.state !== 'success'
        );

        return unfulfilledJob?.id;
      },
    }),
  }),
});

export const {
  useProfilePurchasesMutation,
  useLazyValidateProfileSlugQuery,
  useCreateProfileInfoMutation,
  useGetProfileJobStatusQuery,
  usePostProfileJobRetryMutation,
  useUpdateProfileInfoMutation,
  useGetProfileUnfulfilledJobQuery,
} = hubProfile;
