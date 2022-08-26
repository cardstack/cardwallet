import { useMemo } from 'react';

import {
  useGetRewardPoolTokenBalancesQuery,
  useGetRewardsSafeQuery,
} from '@cardstack/services/rewards-center/rewards-center-api';
import { isLayer1 } from '@cardstack/utils';

import { networkTypes } from '@rainbow-me/helpers/networkTypes';
import { useAccountSettings } from '@rainbow-me/hooks';

const rewardDefaultProgramId = {
  [networkTypes.sokol]: '0x0885ce31D73b63b0Fcb1158bf37eCeaD8Ff0fC72',
  [networkTypes.xdai]: '0x979C9F171fb6e9BC501Aa7eEd71ca8dC27cF1185',
};

const useRewardsDataFetch = () => {
  const { accountAddress, nativeCurrency, network } = useAccountSettings();

  const defaultRewardProgramId = rewardDefaultProgramId[network];

  const query = useMemo(
    () => ({
      params: {
        accountAddress,
        nativeCurrency,
      },
      options: {
        skip: !accountAddress || isLayer1(network),
        refetchOnMountOrArgChange: true,
      },
    }),
    [accountAddress, nativeCurrency, network]
  );

  const {
    isLoading: isLoadingSafes,
    isUninitialized,
    data: { rewardSafes } = {},
  } = useGetRewardsSafeQuery(query.params, query.options);

  const {
    isLoading: isLoadingTokens,
    data: { rewardPoolTokenBalances } = {},
  } = useGetRewardPoolTokenBalancesQuery(query.params, query.options);

  const dustQuery = useMemo(
    () => ({
      params: {
        accountAddress,
        safeAddress: rewardSafes ? rewardSafes[0].address : undefined,
        nativeCurrency,
      },
      options: {
        skip: !accountAddress || isLayer1(network),
        refetchOnMountOrArgChange: true,
      },
    }),
    [accountAddress, rewardSafes, nativeCurrency, network]
  );

  const {
    isLoading: isLoadingTokensWithoutDust,
    data: { rewardPoolTokenBalances: rewardPoolTokenBalancesWithoutDust } = {},
  } = useGetRewardPoolTokenBalancesQuery(dustQuery.params, dustQuery.options);

  // Checks if available tokens matches default program
  const mainPoolTokenInfo = useMemo(
    () =>
      rewardPoolTokenBalances?.find(
        ({ rewardProgramId }) => rewardProgramId === defaultRewardProgramId
      ),
    [rewardPoolTokenBalances, defaultRewardProgramId]
  );

  const claimSheetTokenInfo = useMemo(
    () =>
      rewardPoolTokenBalancesWithoutDust?.find(
        ({ rewardProgramId }) => rewardProgramId === defaultRewardProgramId
      ),
    [rewardPoolTokenBalancesWithoutDust, defaultRewardProgramId]
  );

  const isLoading = useMemo(
    () =>
      isLoadingSafes ||
      isLoadingTokens ||
      isLoadingTokensWithoutDust ||
      (isUninitialized && !isLayer1(network)),
    [
      isLoadingSafes,
      isLoadingTokens,
      isLoadingTokensWithoutDust,
      isUninitialized,
      network,
    ]
  );

  /**
   * For now, the available rewards are the ones inside the Cardstack pool
   * In the future, this will change once we add more reward programs
   */
  const hasRewardsAvailable = !!mainPoolTokenInfo;

  const canClaimAll = !!claimSheetTokenInfo;

  return {
    isLoading,
    rewardSafes,
    rewardPoolTokenBalances,
    mainPoolTokenInfo,
    claimSheetTokenInfo,
    defaultRewardProgramId,
    hasRewardsAvailable,
    canClaimAll,
  };
};

export default useRewardsDataFetch;
