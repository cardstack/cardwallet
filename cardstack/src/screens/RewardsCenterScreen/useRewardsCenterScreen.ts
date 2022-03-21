import { useCallback, useMemo } from 'react';
import {
  useGetRewardPoolTokenBalancesQuery,
  useGetRewardsSafeQuery,
} from '@cardstack/services/rewards-center/rewards-center-api';
import { useAccountSettings } from '@rainbow-me/hooks';
import { networkTypes } from '@rainbow-me/helpers/networkTypes';

const rewardDefaultProgramId = {
  [networkTypes.sokol]: '0x5E4E148baae93424B969a0Ea67FF54c315248BbA',
  //TBD
  [networkTypes.xdai]: '',
};

export const useRewardsCenterScreen = () => {
  const { accountAddress, nativeCurrency, network } = useAccountSettings();

  const query = useMemo(
    () => ({
      params: {
        accountAddress,
        nativeCurrency,
      },
      options: {
        skip: !accountAddress,
      },
    }),
    [accountAddress, nativeCurrency]
  );

  const {
    isLoading: isLoadindSafes,
    data: { rewardSafes } = {},
  } = useGetRewardsSafeQuery(query.params, query.options);

  const {
    isLoading: isLoadingTokens,
    data: { rewardPoolTokenBalances } = {},
  } = useGetRewardPoolTokenBalancesQuery(query.params, query.options);

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
        ({ rewardProgramId }) =>
          rewardProgramId === rewardDefaultProgramId[network]
      ),
    [network, rewardSafes]
  );

  // Checks if available tokens matches default program and has amount
  const mainPoolTokenInfo = useMemo(
    () =>
      rewardPoolTokenBalances?.find(
        ({ rewardProgramId, balance: { amount } }) =>
          Number(amount) > 0 &&
          rewardProgramId === rewardDefaultProgramId[network]
      ),
    [network, rewardPoolTokenBalances]
  );

  const onRegisterPress = useCallback(() => {
    //pass
  }, []);

  return {
    rewardSafes,
    registeredPools,
    rewardPoolTokenBalances,
    isRegistered,
    onRegisterPress,
    hasRewardsAvailable: !!mainPoolTokenInfo,
    mainPoolTokenInfo,
    isLoading: isLoadindSafes || isLoadingTokens,
  };
};
