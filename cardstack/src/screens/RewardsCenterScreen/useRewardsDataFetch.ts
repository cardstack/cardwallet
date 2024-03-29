import { useMemo } from 'react';

import { useIsFetchingDataNewAccount } from '@cardstack/hooks';
import {
  useGetValidRewardsForProgramQuery,
  useGetRewardProgramExplainerQuery,
  useGetRewardPoolTokenBalancesQuery,
  useGetRewardsSafeQuery,
} from '@cardstack/services/rewards-center/rewards-center-api';
import { FullBalanceToken } from '@cardstack/services/rewards-center/rewards-center-types';
import { NetworkType } from '@cardstack/types';
import { findByRewardProgramId } from '@cardstack/utils';

import { useAccountSettings } from '@rainbow-me/hooks';

const rewardDefaultProgramId: { [key in NetworkType]?: string } = {
  [NetworkType.sokol]: '0xab20c80fcc025451a3fc73bB953aaE1b9f640949',
  [NetworkType.gnosis]: '0x979C9F171fb6e9BC501Aa7eEd71ca8dC27cF1185',
};

const useRewardsDataFetch = () => {
  const {
    accountAddress,
    nativeCurrency,
    network,
    noCardPayAccount,
    isOnCardPayNetwork,
  } = useAccountSettings();

  const defaultRewardProgramId = rewardDefaultProgramId[network] as string;

  const query = useMemo(
    () => ({
      params: {
        accountAddress,
        nativeCurrency,
        rewardProgramId: defaultRewardProgramId,
      },
      options: {
        skip: noCardPayAccount,
        refetchOnMountOrArgChange: true,
      },
    }),
    [accountAddress, nativeCurrency, defaultRewardProgramId, noCardPayAccount]
  );

  const {
    isLoading: isLoadingSafes,
    isFetching,
    isUninitialized,
    data: { rewardSafes } = {},
  } = useGetRewardsSafeQuery(query.params, query.options);

  const isRefreshingForNewAccount = useIsFetchingDataNewAccount(isFetching);

  const rewardSafeForProgram = useMemo(
    () => findByRewardProgramId(rewardSafes, defaultRewardProgramId),
    [rewardSafes, defaultRewardProgramId]
  );

  const { data: rewardProgramExplainer } = useGetRewardProgramExplainerQuery(
    defaultRewardProgramId,
    query.options
  );

  const { data: rewards } = useGetValidRewardsForProgramQuery(
    { ...query.params, safeAddress: rewardSafeForProgram?.address },
    { ...query.options, skip: query.options.skip || !rewardSafeForProgram }
  );

  const {
    isLoading: isLoadingTokens,
    data: { rewardPoolTokenBalances } = {},
  } = useGetRewardPoolTokenBalancesQuery(query.params, query.options);

  const {
    isLoading: isLoadingTokensWithoutDust,
    data: { rewardPoolTokenBalances: rewardPoolTokenBalancesWithoutDust } = {},
  } = useGetRewardPoolTokenBalancesQuery(
    {
      ...query.params,
      safeAddress: rewardSafeForProgram?.address,
    },
    {
      skip:
        query.options.skip ||
        isRefreshingForNewAccount ||
        isLoadingSafes ||
        isUninitialized ||
        !rewardSafeForProgram,
      refetchOnMountOrArgChange: true,
    }
  );

  const claimableBalanceToken = useMemo(
    () =>
      findByRewardProgramId(
        rewardPoolTokenBalancesWithoutDust,
        defaultRewardProgramId
      ),
    [rewardPoolTokenBalancesWithoutDust, defaultRewardProgramId]
  );

  const hasClaimableRewards = useMemo(
    () => !!Number(claimableBalanceToken?.balance.amount),
    [claimableBalanceToken]
  );

  // Checks if available tokens matches default program
  const fullBalanceToken: FullBalanceToken | undefined = useMemo(() => {
    const balances = findByRewardProgramId(
      rewardPoolTokenBalances,
      defaultRewardProgramId
    );

    if (balances) {
      return {
        ...balances,
        isClaimable: !!claimableBalanceToken?.balance,
      };
    }
  }, [rewardPoolTokenBalances, claimableBalanceToken, defaultRewardProgramId]);

  /**
   * For now, the available rewards are the ones inside the Cardstack pool
   * In the future, this will change once we add more reward programs
   */

  const hasRewards = useMemo(() => !!Number(fullBalanceToken?.balance.amount), [
    fullBalanceToken,
  ]);

  const isLoading = useMemo(
    () =>
      isLoadingSafes ||
      isLoadingTokens ||
      isLoadingTokensWithoutDust ||
      (isUninitialized && isOnCardPayNetwork),
    [
      isOnCardPayNetwork,
      isLoadingSafes,
      isLoadingTokens,
      isLoadingTokensWithoutDust,
      isUninitialized,
    ]
  );

  return {
    isLoading,
    rewardSafes,
    rewardPoolTokenBalances,
    fullBalanceToken,
    defaultRewardProgramId,
    hasRewards,
    rewards,
    hasClaimableRewards,
    claimableBalanceToken,
    rewardSafeForProgram,
    rewardProgramExplainer,
  };
};

export default useRewardsDataFetch;
