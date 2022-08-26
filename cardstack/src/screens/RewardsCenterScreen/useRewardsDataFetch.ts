import { useMemo } from 'react';

import {
  useGetRewardPoolTokenBalancesQuery,
  useGetRewardsSafeQuery,
} from '@cardstack/services/rewards-center/rewards-center-api';
import { FullBalanceToken } from '@cardstack/services/rewards-center/rewards-center-types';
``;
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

  const claimableBalanceToken = useMemo(
    () =>
      rewardPoolTokenBalancesWithoutDust?.find(
        ({ rewardProgramId }) => rewardProgramId === defaultRewardProgramId
      ),
    [rewardPoolTokenBalancesWithoutDust, defaultRewardProgramId]
  );

  // Checks if available tokens matches default program
  const fullBalanceToken: FullBalanceToken | undefined = useMemo(() => {
    const balances = rewardPoolTokenBalances?.find(
      ({ rewardProgramId }) => rewardProgramId === defaultRewardProgramId
    );

    if (balances) {
      return {
        ...balances,
        isClaimable: !!claimableBalanceToken && !!claimableBalanceToken.balance,
      };
    }
  }, [rewardPoolTokenBalances, claimableBalanceToken, defaultRewardProgramId]);

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
  const hasRewardsAvailable = !!fullBalanceToken;

  return {
    isLoading,
    rewardSafes,
    rewardPoolTokenBalances,
    fullBalanceToken,
    defaultRewardProgramId,
    hasRewardsAvailable,
    claimableBalanceToken,
  };
};

export default useRewardsDataFetch;
