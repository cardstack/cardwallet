import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

import { Routes } from '@cardstack/navigation/routes';
import { useAuthSelector } from '@cardstack/redux/authSlice';
import { usePrimarySafe } from '@cardstack/redux/hooks/usePrimarySafe';
import { usePersistedFlagsSelector } from '@cardstack/redux/persistedFlagsSlice';

import { useWallets } from '@rainbow-me/hooks';

export const useShowOnboarding = () => {
  const { selectedWallet, walletReady } = useWallets();

  const { hasProfile, isLoadingOnInit: isLoadingSafes } = usePrimarySafe();

  const {
    hasSkippedProfileCreation,
    hasSkippedBackup,
  } = usePersistedFlagsSelector();

  const { navigate } = useNavigation();

  const { hasWallet } = useAuthSelector();

  useEffect(() => {
    // Wait until wallet and backup info has properly being loaded.
    if (!walletReady) return;

    if (!selectedWallet.manuallyBackedUp && !hasSkippedBackup) {
      navigate(Routes.BACKUP_EXPLANATION);

      return;
    }

    const noProfile = !isLoadingSafes && !hasProfile;

    const shouldShowProfileCreationFlow =
      hasWallet && noProfile && !hasSkippedProfileCreation;

    if (shouldShowProfileCreationFlow) {
      navigate(Routes.PROFILE_SLUG);
    }
  }, [
    walletReady,
    selectedWallet,
    hasSkippedBackup,
    hasProfile,
    hasSkippedProfileCreation,
    hasWallet,
    isLoadingSafes,
    navigate,
  ]);
};
