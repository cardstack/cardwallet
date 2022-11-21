import BN from 'bn.js';

import { CacheTags, safesApi } from '../safes-api';
import { queryPromiseWrapper } from '../utils';

import {
  claimRewards,
  claimAllRewards,
  fetchRewardPoolTokenBalances,
  fetchRewardsSafe,
  fetchValidProofsWithToken,
  getClaimRewardsGasEstimate,
  getClaimAllRewardsGasEstimate,
  getRegisterGasEstimate,
  getWithdrawGasEstimate,
  registerToRewardProgram,
  withdrawFromRewardSafe,
  getRewardProgramInfo,
} from './rewards-center-service';
import {
  RegisterGasEstimateQueryParams,
  RewardsClaimGasEstimateParams,
  RewardsClaimMutationParams,
  RewardsRegisterMutationParams,
  RewardsRegisterMutationResult,
  RewardsSafeQueryParams,
  RewardsSafeQueryResult,
  RewardsTokenBalancesResult,
  RewardWithdrawGasEstimateParams,
  RewardWithdrawParams,
  SuccessfulTransactionReceipt,
  RewardsSafeQueryParams,
  RewardValidProofsResult,
} from './rewards-center-types';

const rewardsApi = safesApi.injectEndpoints({
  endpoints: builder => ({
    getValidRewardsForProgram: builder.query<
      RewardValidProofsResult,
      RewardsSafeQueryParams
    >({
      async queryFn(params) {
        return queryPromiseWrapper<
          RewardValidProofsResult,
          RewardsSafeQueryParams
        >(fetchValidProofsWithToken, params, {
          errorLogMessage: 'Error fetching reward program proofs',
        });
      },
    }),
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
    getRewardProgramInfo: builder.query<string, string>({
      async queryFn(params) {
        return queryPromiseWrapper<string, string>(
          getRewardProgramInfo,
          params,
          {
            errorLogMessage: 'Error fetching reward program info',
          }
        );
      },
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
    getRewardWithdrawGasEstimate: builder.query<
      BN,
      RewardWithdrawGasEstimateParams
    >({
      async queryFn(params) {
        return queryPromiseWrapper<BN, RewardWithdrawGasEstimateParams>(
          getWithdrawGasEstimate,
          params,
          {
            errorLogMessage: 'Error fetching reward withdraw gas estimate',
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
        });
      },
      invalidatesTags: [CacheTags.REWARDS_SAFE, CacheTags.REWARDS_POOL],
    }),
    getClaimRewardsGasEstimate: builder.query<
      string,
      RewardsClaimGasEstimateParams
    >({
      async queryFn(params) {
        return queryPromiseWrapper<string, RewardsClaimGasEstimateParams>(
          getClaimRewardsGasEstimate,
          params,
          {
            errorLogMessage: 'Error fetching reward claim gas fee',
          }
        );
      },
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
        });
      },
      invalidatesTags: [CacheTags.REWARDS_SAFE, CacheTags.SAFES],
    }),
    getClaimAllRewardsGasEstimate: builder.query<
      string,
      RewardsClaimGasEstimateParams
    >({
      async queryFn(params) {
        return queryPromiseWrapper<string, RewardsClaimGasEstimateParams>(
          getClaimAllRewardsGasEstimate,
          params,
          {
            errorLogMessage: 'Error fetching reward claim gas fee',
          }
        );
      },
    }),
    claimAllRewards: builder.mutation<
      SuccessfulTransactionReceipt[],
      RewardsClaimMutationParams
    >({
      async queryFn(params) {
        return queryPromiseWrapper<
          SuccessfulTransactionReceipt[],
          RewardsClaimMutationParams
        >(claimAllRewards, params, {
          errorLogMessage: 'Error while claiming rewards',
        });
      },
      invalidatesTags: [CacheTags.REWARDS_SAFE, CacheTags.REWARDS_POOL],
    }),
  }),
});

export const {
  useGetValidRewardsForProgramQuery,
  useGetRewardsSafeQuery,
  useGetRewardPoolTokenBalancesQuery,
  useRegisterToRewardProgramMutation,
  useClaimRewardsMutation,
  useGetClaimRewardsGasEstimateQuery,
  useGetRewardProgramInfoQuery,
  useLazyGetRegisterRewardeeGasEstimateQuery,
  useWithdrawRewardBalanceMutation,
  useGetRewardWithdrawGasEstimateQuery,
  useGetClaimAllRewardsGasEstimateQuery,
  useClaimAllRewardsMutation,
} = rewardsApi;
