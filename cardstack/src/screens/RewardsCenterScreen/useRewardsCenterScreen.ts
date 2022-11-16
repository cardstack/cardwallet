import { useMemo } from 'react';

import useRewardsDataFetch from './useRewardsDataFetch';

export const useRewardsCenterScreen = () => {
  const {
    rewardSafes,
    rewardPoolTokenBalances,
    defaultRewardProgramId,
    isLoading,
    fullBalanceToken,
    hasRewards,
    rewards,
    rewardProgramExplainer,
  } = useRewardsDataFetch();

  const registeredPools = useMemo(
    () =>
      rewardSafes?.filter(safe =>
        rewardPoolTokenBalances?.some(
          ({ rewardProgramId }) => rewardProgramId === safe?.rewardProgramId
        )
      ),
    [rewardPoolTokenBalances, rewardSafes]
  );

  const isRegistered = useMemo(
    () =>
      rewardSafes?.some(
        ({ rewardProgramId }) => rewardProgramId === defaultRewardProgramId
      ),
    [rewardSafes, defaultRewardProgramId]
  );

  return {
    rewardSafes,
    registeredPools,
    rewardPoolTokenBalances,
    isRegistered,
    hasRewards,
    rewards,
    fullBalanceToken,
    isLoading,
    rewardProgramExplainer,
  };
};
