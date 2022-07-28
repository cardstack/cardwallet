import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';

import { usePurchaseProfile } from '@cardstack/hooks/usePurchaseProfile';
import { Routes } from '@cardstack/navigation';
import { RouteType } from '@cardstack/navigation/types';
import { CreateProfileInfoParams } from '@cardstack/types';

const defaultPrice = '$0.99';
interface NavParams {
  profile: CreateProfileInfoParams;
}

export const usePurchaseCTAScreen = () => {
  const { navigate } = useNavigation();

  const {
    params: { profile },
  } = useRoute<RouteType<NavParams>>();

  const { purchaseProfile, profileProduct } = usePurchaseProfile(profile);

  const onPressChargeExplanation = useCallback(() => {
    navigate(Routes.PROFILE_CHARGE_EXPLANATION);
  }, [navigate]);

  const localizedValue = useMemo(
    () => profileProduct?.localizedPrice || defaultPrice,
    [profileProduct]
  );

  return {
    onPressChargeExplanation,
    onPressBuy: purchaseProfile,
    localizedValue,
  };
};
