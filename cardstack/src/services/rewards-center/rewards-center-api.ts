import { CacheTags, safesApi } from '../safes-api';
import { queryPromiseWrapper } from '../utils';
import {
  RewardsClaimMutationParams,
  RewardsRegisterMutationParams,
  RewardsRegisterMutationResult,
  RewardsSafeQueryParams,
  RewardsSafeQueryResult,
  RewardsTokenBalancesResult,
  SuccessfulTransactionReceipt,
} from './rewards-center-types';
import {
  claimRewards,
  fetchRewardPoolTokenBalances,
  fetchRewardsSafe,
  registerToRewardProgram,
} from './rewards-center-service';

const rewardsApi = safesApi.injectEndpoints({
  endpoints: builder => ({
    getRewardsSafe: builder.query<
      RewardsSafeQueryResult,
      RewardsSafeQueryParams
    >({
      async queryFn(params) {
        return queryPromiseWrapper<
          RewardsSafeQueryResult,
          RewardsSafeQueryParams
        >(fetchRewardsSafe, params, {
          errorLogMessage: 'Error fetching reward safes',
        });
      },
      providesTags: [CacheTags.REWARDS_SAFE],
    }),
    getRewardPoolTokenBalances: builder.query<
      RewardsTokenBalancesResult,
      RewardsSafeQueryParams
    >({
      async queryFn(params) {
        return queryPromiseWrapper<
          RewardsTokenBalancesResult,
          RewardsSafeQueryParams
        >(fetchRewardPoolTokenBalances, params, {
          errorLogMessage: 'Error fetching reward pool token balances',
        });
      },
      providesTags: [CacheTags.REWARDS_SAFE],
    }),
    registerToRewardProgram: builder.mutation<
      RewardsRegisterMutationResult,
      RewardsRegisterMutationParams
    >({
      async queryFn(params) {
        return queryPromiseWrapper<
          RewardsRegisterMutationResult,
          RewardsRegisterMutationParams
        >(registerToRewardProgram, params, {
          errorLogMessage: 'Error while registering to reward program',
          resetHdProvider: true,
        });
      },
      invalidatesTags: [CacheTags.REWARDS_SAFE],
    }),
    claimRewards: builder.mutation<
      SuccessfulTransactionReceipt[],
      RewardsClaimMutationParams
    >({
      async queryFn(params) {
        return queryPromiseWrapper<
          SuccessfulTransactionReceipt[],
          RewardsClaimMutationParams
        >(claimRewards, params, {
          errorLogMessage: 'Error while claiming rewards',
          resetHdProvider: true,
        });
      },
      invalidatesTags: [CacheTags.REWARDS_SAFE],
    }),
  }),
});

export const {
  useGetRewardsSafeQuery,
  useGetRewardPoolTokenBalancesQuery,
  useRegisterToRewardProgramMutation,
  useClaimRewardsMutation,
} = rewardsApi;
