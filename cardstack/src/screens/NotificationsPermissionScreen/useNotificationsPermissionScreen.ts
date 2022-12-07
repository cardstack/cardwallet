import { useCallback } from 'react';

import { useUpdateNotificationPreferences } from '@cardstack/hooks';
import { useShowOnboarding } from '@cardstack/hooks/onboarding/useShowOnboarding';
import { checkPushPermissionAndRegisterToken } from '@cardstack/models/firebase';
import { Routes } from '@cardstack/navigation';
import { usePersistedFlagsActions } from '@cardstack/redux/persistedFlagsSlice';
import { NotificationsOptionsType } from '@cardstack/types';

export const useNotificationsPermissionScreen = () => {
  const { navigateToNextOnboardingStep } = useShowOnboarding();
  const { triggerSkipNotificationPermission } = usePersistedFlagsActions();

  const {
    options,
    isError,
    onUpdateOptionStatus,
  } = useUpdateNotificationPreferences();

  const handleOnUpdateOption = useCallback(
    async (option: NotificationsOptionsType, isEnabled: boolean) =>
      onUpdateOptionStatus(option.type, isEnabled),
    [onUpdateOptionStatus]
  );

  const handleEnableNotificationsOnPress = useCallback(async () => {
    const accepted = await checkPushPermissionAndRegisterToken();

    if (!accepted) {
      triggerSkipNotificationPermission();
    }

    navigateToNextOnboardingStep(Routes.BACKUP_EXPLANATION);
  }, [triggerSkipNotificationPermission, navigateToNextOnboardingStep]);

  const handleSkipOnPress = useCallback(() => {
    triggerSkipNotificationPermission();
    navigateToNextOnboardingStep();
  }, [triggerSkipNotificationPermission, navigateToNextOnboardingStep]);

  return {
    options,
    isError,
    onUpdateOptionStatus,
    handleOnUpdateOption,
    handleEnableNotificationsOnPress,
    handleSkipOnPress,
  };
};
