import { MerchantSafe } from '@cardstack/cardpay-sdk';

import { CacheTags, safesApi } from '../safes-api';
import { queryPromiseWrapper } from '../utils';

import { claimMerchantRevenue, createProfile } from './merchant-service';
import {
  ClaimRevenueQueryParams,
  CreateProfileQueryParams,
} from './merchant-types';

const merchantApi = safesApi.injectEndpoints({
  endpoints: builder => ({
    claimRevenue: builder.mutation<void, ClaimRevenueQueryParams>({
      async queryFn(params) {
        return queryPromiseWrapper<void, ClaimRevenueQueryParams>(
          claimMerchantRevenue,
          params,
          {
            errorLogMessage: 'Error claiming merchant revenue',
          }
        );
      },
      invalidatesTags: [CacheTags.SAFES],
    }),
    createProfile: builder.mutation<MerchantSafe, CreateProfileQueryParams>({
      async queryFn(params) {
        return queryPromiseWrapper<MerchantSafe, CreateProfileQueryParams>(
          createProfile,
          params,
          {
            errorLogMessage: 'Error creating profile',
          }
        );
      },
      invalidatesTags: [CacheTags.SAFES],
    }),
  }),
});

export const {
  useClaimRevenueMutation,
  useCreateProfileMutation,
} = merchantApi;
