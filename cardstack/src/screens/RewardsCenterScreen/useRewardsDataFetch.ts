import { useMemo } from 'react';

import { useIsFetchingDataNewAccount } from '@cardstack/hooks';
import {
  useGetRewardPoolTokenBalancesQuery,
  useGetRewardsSafeQuery,
} from '@cardstack/services/rewards-center/rewards-center-api';
import { FullBalanceToken } from '@cardstack/services/rewards-center/rewards-center-types';
import { NetworkType } from '@cardstack/types';
import { findByRewardProgramId, isCardPayCompatible } from '@cardstack/utils';

import { useAccountSettings } from '@rainbow-me/hooks';

const rewardDefaultProgramId: { [key in NetworkType]?: string } = {
  [NetworkType.sokol]: '0x0885ce31D73b63b0Fcb1158bf37eCeaD8Ff0fC72',
  [NetworkType.gnosis]: '0x979C9F171fb6e9BC501Aa7eEd71ca8dC27cF1185',
};

const useRewardsDataFetch = () => {
  const { accountAddress, nativeCurrency, network } = useAccountSettings();

  const defaultRewardProgramId = rewardDefaultProgramId[network] as string;

  const query = useMemo(
    () => ({
      params: {
        accountAddress,
        nativeCurrency,
        rewardProgramId: defaultRewardProgramId,
      },
      options: {
        skip: !isCardPayCompatible(network) || !accountAddress,
        refetchOnMountOrArgChange: true,
      },
    }),
    [accountAddress, nativeCurrency, defaultRewardProgramId, network]
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
      (isUninitialized && isCardPayCompatible(network)),
    [
      isLoadingSafes,
      isLoadingTokens,
      isLoadingTokensWithoutDust,
      isUninitialized,
      network,
    ]
  );

  return {
    isLoading,
    rewardSafes,
    rewardPoolTokenBalances,
    fullBalanceToken,
    defaultRewardProgramId,
    hasRewards,
    hasClaimableRewards,
    claimableBalanceToken,
    rewardSafeForProgram,
  };
};

export default useRewardsDataFetch;
