import { useCallback, useMemo } from 'react';
import {
  useGetRewardPoolTokenBalancesQuery,
  useGetRewardsSafeQuery,
} from '@cardstack/services/rewards-center/rewards-center-api';
import { useAccountSettings } from '@rainbow-me/hooks';

export const useRewardsCenterScreen = () => {
  const { accountAddress, nativeCurrency } = useAccountSettings();

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

  const { data: { rewardSafes } = {} } = useGetRewardsSafeQuery(
    query.params,
    query.options
  );

  const {
    data: { rewardPoolTokenBalances } = {},
  } = useGetRewardPoolTokenBalancesQuery(query.params, query.options);

  const onRegisterPress = useCallback(() => {
    //pass
  }, []);

  const registeredPools = useMemo(
    () =>
      rewardSafes?.filter(safe =>
        rewardPoolTokenBalances?.some(
          ({ rewardProgramId }) => rewardProgramId === safe?.rewardProgramId
        )
      ),
    [rewardPoolTokenBalances, rewardSafes]
  );

  return {
    rewardSafes,
    registeredPools,
    rewardPoolTokenBalances,
    isRegistered: !!rewardSafes?.length,
    hasRewardsAvailable: false,
    onRegisterPress,
  };
};
