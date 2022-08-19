import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

import { Routes } from '@cardstack/navigation/routes';
import { useAuthSelector } from '@cardstack/redux/authSlice';
import { usePrimarySafe } from '@cardstack/redux/hooks/usePrimarySafe';
import { usePersistedFlagsSelector } from '@cardstack/redux/persistedFlagsSlice';

export const useShowOnboarding = () => {
  const { primarySafe, hasFetchedProfile } = usePrimarySafe();
  const { hasSkippedProfileCreation } = usePersistedFlagsSelector();

  const { navigate } = useNavigation();

  const { hasWallet } = useAuthSelector();

  useEffect(() => {
    const noProfile = hasFetchedProfile && !primarySafe;

    const shouldShowProfileCreationFlow =
      hasWallet && noProfile && !hasSkippedProfileCreation;

    if (shouldShowProfileCreationFlow) {
      navigate(Routes.PROFILE_SLUG);
    }
  }, [
    hasFetchedProfile,
    hasWallet,
    navigate,
    primarySafe,
    hasSkippedProfileCreation,
  ]);
};
