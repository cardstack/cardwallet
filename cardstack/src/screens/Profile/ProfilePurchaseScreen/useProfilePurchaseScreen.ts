import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback } from 'react';

import { useBooleanState, useRemoteConfigs } from '@cardstack/hooks';
import { useCreateProfile } from '@cardstack/hooks/merchant/useCreateProfile';
import { usePurchaseProfile } from '@cardstack/hooks/usePurchaseProfile';
import { Routes } from '@cardstack/navigation';
import { RouteType } from '@cardstack/navigation/types';
import { usePersistedFlagsActions } from '@cardstack/redux/persistedFlagsSlice';
import { useGetSafesDataQuery } from '@cardstack/services';
import { CreateProfileInfoParams } from '@cardstack/services/hub/hub-types';

import { Alert } from '@rainbow-me/components/alerts';
import { useAccountSettings } from '@rainbow-me/hooks';

interface NavParams {
  profile: CreateProfileInfoParams;
}

export const useProfilePurchaseScreen = () => {
  const { navigate } = useNavigation();

  const {
    accountAddress,
    nativeCurrency,
    noCardPayAccount,
  } = useAccountSettings();

  const { configs } = useRemoteConfigs();

  const { hasPrepaidCards: showPrepaidCardOption } = useGetSafesDataQuery(
    { address: accountAddress, nativeCurrency },

    {
      selectFromResult: ({ data }) => ({
        hasPrepaidCards: !!data?.prepaidCards?.length,
      }),
      skip: noCardPayAccount,
    }
  );

  const {
    params: { profile },
  } = useRoute<RouteType<NavParams>>();

  const { purchaseProfile, localizedPrice } = usePurchaseProfile(profile);

  const { purchaseWithPrepaidCard } = useCreateProfile(profile);

  const onPressChargeExplanation = useCallback(() => {
    navigate(Routes.PROFILE_CHARGE_EXPLANATION, {
      localizedValue: localizedPrice,
    });
  }, [localizedPrice, navigate]);

  const [
    inPurchaseOngoing,
    setPurchaseStart,
    setPurchaseEnd,
  ] = useBooleanState();

  const onPressBuy = useCallback(async () => {
    setPurchaseStart();

    if (configs.featureProfilePurchaseOnboarding) {
      await purchaseProfile();
    } else {
      Alert({
        title: 'Oops!',
        message: 'This feature is currently unavailable',
      });
    }

    setPurchaseEnd();
  }, [configs, purchaseProfile, setPurchaseStart, setPurchaseEnd]);

  const { triggerSkipProfileCreation } = usePersistedFlagsActions();

  return {
    onPressChargeExplanation,
    onPressBuy,
    inPurchaseOngoing,
    onPressPrepaidCards: purchaseWithPrepaidCard,
    showPrepaidCardOption,
    localizedPrice,
    triggerSkipProfileCreation,
  };
};
