import { useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/core';

import { RouteType } from '@cardstack/navigation/types';

import { TokenWithSafeAddress } from '@cardstack/screens/RewardsCenterScreen/components';
import { MainRoutes } from '@cardstack/navigation';

interface NavParams {
  tokenInfo: TokenWithSafeAddress;
  fromRewardSafe: string;
  withdrawTo: any; // TODO: create right type with avatar customization
}

export const useRewardWithdrawConfimationScreen = () => {
  const { params } = useRoute<RouteType<NavParams>>();

  const { navigate } = useNavigation();

  const onCancelPress = useCallback(() => {
    navigate(MainRoutes.REWARDS_CENTER_SCREEN);
  }, [navigate]);

  const onConfirmPress = useCallback(() => {
    //TODO
  }, []);

  return {
    params,
    onCancelPress,
    onConfirmPress,
  };
};
