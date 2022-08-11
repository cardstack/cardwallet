import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef } from 'react';

import { Routes } from '@cardstack/navigation/routes';
import { useAuthSelector } from '@cardstack/redux/authSlice';
import { usePrimarySafe } from '@cardstack/redux/hooks/usePrimarySafe';

export const useShowOnboarding = () => {
  const { primarySafe, hasFetchedProfile } = usePrimarySafe();

  const { navigate } = useNavigation();

  const { hasWallet } = useAuthSelector();

  // TODO: Maybe persist the skip
  const isOnboarding = useRef(false);

  useEffect(() => {
    const noProfile = hasFetchedProfile && !primarySafe;

    if (hasWallet && noProfile && !isOnboarding.current) {
      navigate(Routes.PROFILE_SLUG);
      isOnboarding.current = true;
    }
  }, [hasFetchedProfile, hasWallet, navigate, primarySafe]);
};
