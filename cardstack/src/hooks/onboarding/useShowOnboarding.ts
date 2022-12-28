import { useNavigation } from '@react-navigation/native';
import { RouteNames } from 'globals';
import { useMemo, useCallback } from 'react';

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

  // Will check next possible onboarding step.
  // Calling this right after updating a store value will not have the dependencies updated,
  // so in some cases is necessary to call `navigateOnboardingTo` directly.
  const getNextOnboardingStep = useCallback(() => {
    if (!hasSkippedNotificationPermission) {
      return Routes.NOTIFICATIONS_PERMISSION;
    }

    if (shouldShowBackupFlow) {
      return Routes.BACKUP_EXPLANATION;
    }

    if (shouldShowProfileCreationFlow) {
      return Routes.PROFILE_SLUG;
    }
  }, [
    shouldShowBackupFlow,
    shouldShowProfileCreationFlow,
    hasSkippedNotificationPermission,
  ]);

  // Will navigate imperactively to provided route.
  const navigateOnboardingTo = useCallback(
    (route: RouteNames) => {
      // Avoid showing already completed flow.
      if (route === Routes.BACKUP_EXPLANATION && !shouldShowBackupFlow) {
        navigateOnboardingTo(Routes.PROFILE_SLUG);

        return;
      }

      if (route === Routes.PROFILE_SLUG && !shouldShowProfileCreationFlow) {
        navigate(Routes.WALLET_SCREEN);

        return;
      }

      navigate(route);
    },
    [navigate, shouldShowProfileCreationFlow, shouldShowBackupFlow]
  );

  // Gets next onboarding step and tries to navigate.
  const navigateToNextOnboardingStep = useCallback(() => {
    const nextStep = getNextOnboardingStep();

    if (nextStep) {
      navigateOnboardingTo(nextStep);
    }
  }, [getNextOnboardingStep, navigateOnboardingTo]);

  return {
    navigateOnboardingTo,
    navigateToNextOnboardingStep,
    shouldShowBackupFlow,
    shouldShowProfileCreationFlow,
    isLoadingSafes,
  };
};
