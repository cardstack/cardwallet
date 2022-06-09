import { useMemo } from 'react';

import useRewardsDataFetch from './useRewardsDataFetch';

export const useRewardsCenterScreen = () => {
  const {
    rewardSafes,
    rewardPoolTokenBalances,
    defaultRewardProgramId,
    isLoading,
    mainPoolTokenInfo,
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
    hasRewardsAvailable: !!mainPoolTokenInfo,
    mainPoolTokenInfo,
    isLoading,
  };
};
