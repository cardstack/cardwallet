import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';

import { usePurchaseProfile } from '@cardstack/hooks/usePurchaseProfile';
import { Routes } from '@cardstack/navigation';
import { RouteType } from '@cardstack/navigation/types';
import { useGetSafesDataQuery } from '@cardstack/services';
import { CreateProfileInfoParams } from '@cardstack/services/hub/hub-types';
import { isLayer1 } from '@cardstack/utils';

import { useAccountSettings } from '@rainbow-me/hooks';

const defaultPrice = '$0.99';
interface NavParams {
  profile: CreateProfileInfoParams;
}

export const usePurchaseCTAScreen = () => {
  const { navigate } = useNavigation();

  const { network, accountAddress, nativeCurrency } = useAccountSettings();

  const { hasPrepaidCards: showPrepaidCardOption } = useGetSafesDataQuery(
    { address: accountAddress, nativeCurrency },

    {
      selectFromResult: ({ data }) => ({
        hasPrepaidCards: !!data?.prepaidCards?.length,
      }),
      skip: isLayer1(network) || !accountAddress,
    }
  );

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

  const onPressPrepaidCards = useCallback(() => {
    // TBD
  }, []);

  return {
    onPressChargeExplanation,
    onPressBuy: purchaseProfile,
    onPressPrepaidCards,
    showPrepaidCardOption,
    localizedValue,
  };
};
