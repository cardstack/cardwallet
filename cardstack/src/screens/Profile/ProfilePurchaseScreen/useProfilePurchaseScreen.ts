import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';

import { useBooleanState, useRemoteConfigs } from '@cardstack/hooks';
import { useCreateProfile } from '@cardstack/hooks/merchant/useCreateProfile';
import { usePurchaseProfile } from '@cardstack/hooks/usePurchaseProfile';
import { Routes } from '@cardstack/navigation';
import { RouteType } from '@cardstack/navigation/types';
import { usePersistedFlagsActions } from '@cardstack/redux/persistedFlagsSlice';
import { useGetSafesDataQuery } from '@cardstack/services';
import { CreateProfileInfoParams } from '@cardstack/services/hub/hub-types';
import { isLayer1 } from '@cardstack/utils';

import { Alert } from '@rainbow-me/components/alerts';
import { useAccountSettings } from '@rainbow-me/hooks';

const defaultPrice = '$0.99';
interface NavParams {
  profile: CreateProfileInfoParams;
}

export const useProfilePurchaseScreen = () => {
  const { navigate } = useNavigation();

  const { network, accountAddress, nativeCurrency } = useAccountSettings();

  const { configs } = useRemoteConfigs();

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

  const { purchaseWithPrepaidCard } = useCreateProfile(profile);

  const localizedValue = useMemo(
    () => profileProduct?.localizedPrice || defaultPrice,
    [profileProduct]
  );

  const onPressChargeExplanation = useCallback(() => {
    navigate(Routes.PROFILE_CHARGE_EXPLANATION, { localizedValue });
  }, [localizedValue, navigate]);

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
    localizedValue,
    triggerSkipProfileCreation,
  };
};
