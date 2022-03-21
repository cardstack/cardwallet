import { useCallback, useMemo } from 'react';
import {
  useGetRewardPoolTokenBalancesQuery,
  useGetRewardsSafeQuery,
} from '@cardstack/services/rewards-center/rewards-center-api';
import { useAccountSettings } from '@rainbow-me/hooks';
import { networkTypes } from '@rainbow-me/helpers/networkTypes';

const rewardDefaultProgramId = {
  [networkTypes.sokol]: '0x5E4E148baae93424B969a0Ea67FF54c315248BbA',
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

  const { data: { rewardSafes } = {} } = useGetRewardsSafeQuery(
    query.params,
    query.options
  );

  const {
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

  const onRegisterPress = useCallback(() => {
    //pass
  }, []);

  return {
    rewardSafes,
    registeredPools,
    rewardPoolTokenBalances,
    isRegistered,
    onRegisterPress,
    hasRewardsAvailable: !!registeredPools?.length,
  };
};
