import { useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/core';
import { MerchantOrDepotSafe } from '@cardstack/types';
import { RouteType } from '@cardstack/navigation/types';
import { useAccountSettings } from '@rainbow-me/hooks';

import { useGetSafesDataQuery } from '@cardstack/services';

import { TokenWithSafeAddress } from '@cardstack/screens/RewardsCenterScreen/components';
import { MainRoutes } from '@cardstack/navigation';

interface SafeResultType {
  availableSafesToWithdraw: MerchantOrDepotSafe[];
  isLoading: boolean;
}

export const useRewardWithdrawToScreen = () => {
  const {
    params: { tokenInfo },
  } = useRoute<RouteType<{ tokenInfo: TokenWithSafeAddress }>>();

  const { navigate } = useNavigation();

  const { accountAddress, nativeCurrency } = useAccountSettings();

  const { availableSafesToWithdraw = [], isLoading } = useGetSafesDataQuery(
    { address: accountAddress, nativeCurrency },
    {
      selectFromResult: ({ data, ...rest }): SafeResultType => ({
        availableSafesToWithdraw: [
          ...(data?.merchantSafes || []),
          ...(data?.depots || []),
        ].filter(Boolean),
        ...rest,
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
    isLoading,
  };
};
