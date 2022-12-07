import { useNavigation } from '@react-navigation/native';
import { useMemo, useCallback } from 'react';

import { needsToAskForNotificationsPermissions } from '@cardstack/models/firebase';
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
    hasSkippedNotificationPermission,
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

  const navigateToNextOnboardingStep = useCallback(
    async (step?: string) => {
      if (step) {
        // Avoid showing profile flow when not wanted.
        if (step === Routes.PROFILE_SLUG && !shouldShowProfileCreationFlow) {
          return;
        }

        console.log('::: should navigate to step:', step);
        navigate(step);

        return;
      }

      const askForNotificationsPermissions = await needsToAskForNotificationsPermissions();

      console.log('::: ', {
        askForNotificationsPermissions,
        hasSkippedNotificationPermission,
        shouldShowBackupFlow,
        shouldShowProfileCreationFlow,
      });

      if (askForNotificationsPermissions && !hasSkippedNotificationPermission) {
        console.log('::: should navigate to', Routes.NOTIFICATIONS_PERMISSION);
        navigate(Routes.NOTIFICATIONS_PERMISSION);

        return;
      }

      if (shouldShowBackupFlow) {
        console.log('::: should navigate to', Routes.BACKUP_EXPLANATION);
        navigate(Routes.BACKUP_EXPLANATION);

        return;
      }

      if (shouldShowProfileCreationFlow) {
        console.log('::: should navigate to', Routes.PROFILE_SLUG);
        navigate(Routes.PROFILE_SLUG);

        return;
      }
    },
    [
      navigate,
      shouldShowBackupFlow,
      shouldShowProfileCreationFlow,
      hasSkippedNotificationPermission,
    ]
  );

  return {
    navigateToNextOnboardingStep,
    shouldShowBackupFlow,
    shouldShowProfileCreationFlow,
    isLoadingSafes,
  };
};
