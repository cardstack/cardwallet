import { useNavigation } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';

import { Routes } from '@cardstack/navigation';
import { usePrimarySafe } from '@cardstack/redux/hooks/usePrimarySafe';
import { remoteFlags } from '@cardstack/services/remote-config';

export const useShowOnboarding = () => {
  const { navigate } = useNavigation();
  const { primarySafe, isFetching } = usePrimarySafe();

  const isOnboardingNeeded = useMemo(
    () =>
      !isFetching &&
      !primarySafe &&
      remoteFlags().featureProfilePurchaseOnboarding,
    [isFetching, primarySafe]
  );

  const showOnboarding = useCallback(() => {
    if (isOnboardingNeeded) {
      navigate(Routes.PROFILE_SLUG);
    }
  }, [isOnboardingNeeded, navigate]);

  return {
    isOnboardingNeeded,
    showOnboarding,
  };
};
