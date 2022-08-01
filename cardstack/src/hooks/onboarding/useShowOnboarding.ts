import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

import { Routes } from '@cardstack/navigation';
import { usePrimarySafe } from '@cardstack/redux/hooks/usePrimarySafe';
import { remoteFlags } from '@cardstack/services/remote-config';

export const useShowOnboarding = () => {
  const { navigate } = useNavigation();
  const { primarySafe, isFetching } = usePrimarySafe();

  const showOnboardingIfNeeded = useCallback(() => {
    if (
      !isFetching &&
      !primarySafe &&
      remoteFlags().featureProfilePurchaseOnboarding
    ) {
      navigate(Routes.PROFILE_SLUG);

      return true;
    }

    return false;
  }, [navigate, isFetching, primarySafe]);

  return {
    showOnboardingIfNeeded,
  };
};
