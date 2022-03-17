import { CacheTags, safesApi } from '../safes-api';
import { queryPromiseWrapper } from '../utils';
import {
  RewardsSafeQueryParams,
  RewardsSafeQueryResult,
} from './rewards-center-types';
import { fetchRewardsSafe } from './rewards-center-service';

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
  }),
});

export const { useGetRewardsSafeQuery } = rewardsApi;
