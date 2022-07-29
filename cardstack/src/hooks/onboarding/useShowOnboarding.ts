import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useMemo } from 'react';

import { Routes } from '@cardstack/navigation';
import { usePrimarySafe } from '@cardstack/redux/hooks/usePrimarySafe';

import { useWalletManager, useWallets } from '@rainbow-me/hooks';

export const useShowOnboarding = () => {
  const { navigate } = useNavigation();
  const { primarySafe, isFetching } = usePrimarySafe();
  // const { initializeWallet } = useWalletManager();
  // const { walletReady } = useWallets();
  // const initialized = useRef(false);

  const isOnboardingNeeded = useMemo(() => !isFetching && !primarySafe, [
    isFetching,
    primarySafe,
  ]);

  const showOnboarding = useCallback(() => {
    if (isOnboardingNeeded) {
      navigate(Routes.PROFILE_SLUG);
    }
  }, [isOnboardingNeeded, navigate]);

  // useEffect(() => {
  //   if (!initialized.current && !walletReady) {
  //     initializeWallet();
  //     initialized.current = true;
  //   }
  // }, [initializeWallet, walletReady]);

  return {
    isOnboardingNeeded,
    showOnboarding,
  };
};
