import { useNavigation } from '@react-navigation/native';
import { useMemo, useCallback, useEffect } from 'react';

import { Routes } from '@cardstack/navigation/routes';
import { useAuthSelector } from '@cardstack/redux/authSlice';
import { usePrimarySafe } from '@cardstack/redux/hooks/usePrimarySafe';
import { usePersistedFlagsSelector } from '@cardstack/redux/persistedFlagsSlice';

import { useWallets } from '@rainbow-me/hooks';

export const useShowOnboarding = () => {
  const { selectedWallet } = useWallets();

  const { hasProfile, isLoadingOnInit: isLoadingSafes } = usePrimarySafe();

  const {
    hasSkippedProfileCreation,
    hasSkippedBackup,
  } = usePersistedFlagsSelector();

  const { navigate } = useNavigation();

  const { hasWallet } = useAuthSelector();

  const shouldShowBackupFlow = useMemo(
    () => !selectedWallet.manuallyBackedUp && !hasSkippedBackup,
    [selectedWallet, hasSkippedBackup]
  );

  const shouldShowProfileCreationFlow = useMemo(() => {
    const noProfile = !isLoadingSafes && !hasProfile;

    return hasWallet && noProfile && !hasSkippedProfileCreation;
  }, [hasProfile, hasSkippedProfileCreation, hasWallet, isLoadingSafes]);

  useEffect(() => {
    console.log('::: useShowOnboarding', {
      shouldShowBackupFlow,
      shouldShowProfileCreationFlow,
    });
  }, [shouldShowBackupFlow, shouldShowProfileCreationFlow]);

  const navigateToNextOnboardingStep = useCallback(
    (step?: string) => {
      if (step) {
        navigate(step);

        return;
      }

      if (shouldShowBackupFlow) {
        navigate(Routes.BACKUP_EXPLANATION);

        return;
      }

      if (shouldShowProfileCreationFlow) {
        navigate(Routes.PROFILE_SLUG);
      }
    },
    [navigate, shouldShowBackupFlow, shouldShowProfileCreationFlow]
  );

  return {
    navigateToNextOnboardingStep,
    shouldShowBackupFlow,
    shouldShowProfileCreationFlow,
  };
};
