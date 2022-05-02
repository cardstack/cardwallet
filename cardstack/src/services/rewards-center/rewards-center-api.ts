import BN from 'bn.js';

import { CacheTags, safesApi } from '../safes-api';
import { queryPromiseWrapper } from '../utils';

import {
  claimRewards,
  fetchRewardPoolTokenBalances,
  fetchRewardsSafe,
  getRegisterGasEstimate,
  getWithdrawGasEstimate,
  registerToRewardProgram,
  withdrawFromRewardSafe,
} from './rewards-center-service';
import {
  RegisterGasEstimateQueryParams,
  RewardsClaimMutationParams,
  RewardsRegisterMutationParams,
  RewardsRegisterMutationResult,
  RewardsSafeQueryParams,
  RewardsSafeQueryResult,
  RewardsTokenBalancesResult,
  RewardWithdrawGasEstimateParams,
  RewardWithdrawParams,
  SuccessfulTransactionReceipt,
} from './rewards-center-types';

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
          resetHdProvider: false,
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
          resetHdProvider: false,
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
          resetHdProvider: false,
        });
      },
      invalidatesTags: [CacheTags.REWARDS_SAFE, CacheTags.SAFES],
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
  useGetRewardWithdrawGasEstimateQuery,
} = rewardsApi;
