import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';

import { usePurchaseProfile } from '@cardstack/hooks/usePurchaseProfile';
import { Routes } from '@cardstack/navigation';
import { RouteType } from '@cardstack/navigation/types';
import { CreateProfileInfoParams } from '@cardstack/services/hub/hub-types';

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

  const localizedValue = useMemo(
    () => profileProduct?.localizedPrice || defaultPrice,
    [profileProduct]
  );

  const onPressChargeExplanation = useCallback(() => {
    navigate(Routes.PROFILE_CHARGE_EXPLANATION, { localizedValue });
  }, [localizedValue, navigate]);

  return {
    onPressChargeExplanation,
    onPressBuy: purchaseProfile,
    localizedValue,
  };
};
