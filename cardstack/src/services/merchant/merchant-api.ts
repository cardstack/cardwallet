import { CacheTags, safesApi } from '../safes-api';
import { queryPromiseWrapper } from '../utils';
import { ClaimRevenueQueryParams } from './merchant-types';
import { claimMerchantRevenue } from './merchant-service';

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
  }),
});

export const { useClaimRevenueMutation } = merchantApi;
