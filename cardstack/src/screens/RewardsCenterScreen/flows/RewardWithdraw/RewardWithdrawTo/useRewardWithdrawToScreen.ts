import { useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/core';
import { RouteType } from '@cardstack/navigation/types';
import { useAccountSettings } from '@rainbow-me/hooks';

import { useGetSafesDataQuery } from '@cardstack/services';

import { TokenWithSafeAddress } from '@cardstack/screens/RewardsCenterScreen/components';
import { MainRoutes } from '@cardstack/navigation';

export const useRewardWithdrawToScreen = () => {
  const {
    params: { tokenInfo },
  } = useRoute<RouteType<{ tokenInfo: TokenWithSafeAddress }>>();

  const { navigate } = useNavigation();

  const { accountAddress, nativeCurrency } = useAccountSettings();

  const { availableSafesToWithdraw } = useGetSafesDataQuery(
    { address: accountAddress, nativeCurrency },
    {
      selectFromResult: ({ data }) => ({
        availableSafesToWithdraw: [
          ...data?.merchantSafes,
          ...data?.depots,
        ].filter(Boolean),
      }),
    }
  );

  const onSafePress = useCallback(
    safe => {
      navigate(MainRoutes.REWARD_WITHDRAW_CONFIRMATION, {
        tokenInfo,
        fromRewardSafe: tokenInfo.safeAddress,
        withdrawTo: safe,
      });
    },
    [navigate, tokenInfo]
  );

  return {
    onSafePress,
    availableSafesToWithdraw,
  };
};
