import { CacheTags, safesApi } from '../safes-api';
import { queryPromiseWrapper } from '../utils';
import {
  RegisterGasEstimateQueryParams,
  RewardsClaimMutationParams,
  RewardsRegisterMutationParams,
  RewardsRegisterMutationResult,
  RewardsSafeQueryParams,
  RewardsSafeQueryResult,
  RewardsTokenBalancesResult,
  RewardWithdrawParams,
  SuccessfulTransactionReceipt,
} from './rewards-center-types';
import {
  claimRewards,
  fetchRewardPoolTokenBalances,
  fetchRewardsSafe,
  getRegisterGasEstimate,
  registerToRewardProgram,
  withdrawFromRewardSafe,
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
      providesTags: [CacheTags.REWARDS_POOL],
    }),
    getRegisterRewardeeGasEstimate: builder.query<
      number,
      RegisterGasEstimateQueryParams
    >({
      async queryFn(params) {
        return queryPromiseWrapper<number, RegisterGasEstimateQueryParams>(
          getRegisterGasEstimate,
          params,
          {
            errorLogMessage: 'Error fetching rewardee register gas estimate',
            timeout: 60000, // 1 min
          }
        );
      },
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
      invalidatesTags: [CacheTags.REWARDS_SAFE, CacheTags.REWARDS_POOL],
    }),
    withdrawRewardBalance: builder.mutation<
      SuccessfulTransactionReceipt,
      RewardWithdrawParams
    >({
      async queryFn(params) {
        return queryPromiseWrapper<
          SuccessfulTransactionReceipt,
          RewardWithdrawParams
        >(withdrawFromRewardSafe, params, {
          errorLogMessage: 'Error while withdrawing reward balance',
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
  useLazyGetRegisterRewardeeGasEstimateQuery,
  useWithdrawRewardBalanceMutation,
} = rewardsApi;
