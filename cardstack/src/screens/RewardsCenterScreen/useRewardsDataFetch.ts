import { useMemo } from 'react';

import {
  useGetRewardPoolTokenBalancesQuery,
  useGetRewardsSafeQuery,
} from '@cardstack/services/rewards-center/rewards-center-api';
import { isLayer1 } from '@cardstack/utils';

import { networkTypes } from '@rainbow-me/helpers/networkTypes';
import { useAccountSettings } from '@rainbow-me/hooks';

const rewardDefaultProgramId = {
  [networkTypes.sokol]: '0x5E4E148baae93424B969a0Ea67FF54c315248BbA',
  // TestID
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

  // Checks if available tokens matches default program and has amount
  const mainPoolTokenInfo = useMemo(
    () =>
      rewardPoolTokenBalances?.find(
        ({ rewardProgramId, balance: { amount } }) =>
          Number(amount) > 0 && rewardProgramId === defaultRewardProgramId
      ),
    [rewardPoolTokenBalances, defaultRewardProgramId]
  );

  const isLoading = useMemo(
    () =>
      isLoadingSafes ||
      isLoadingTokens ||
      (isUninitialized && !isLayer1(network)),
    [isLoadingSafes, isLoadingTokens, isUninitialized, network]
  );

  return {
    isLoading,
    rewardSafes,
    rewardPoolTokenBalances,
    mainPoolTokenInfo,
    defaultRewardProgramId,
  };
};

export default useRewardsDataFetch;
