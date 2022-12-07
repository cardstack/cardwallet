import { useCallback } from 'react';

import { useUpdateNotificationPreferences } from '@cardstack/hooks';
import { useShowOnboarding } from '@cardstack/hooks/onboarding/useShowOnboarding';
import { checkPushPermissionAndRegisterToken } from '@cardstack/models/firebase';
import { Routes } from '@cardstack/navigation';
import { usePersistedFlagsActions } from '@cardstack/redux/persistedFlagsSlice';
import { NotificationsOptionsType } from '@cardstack/types';

export const useNotificationsPermissionScreen = () => {
  const { navigateOnboardingTo } = useShowOnboarding();

  const { triggerSkipNotificationPermission } = usePersistedFlagsActions();

  const {
    options,
    isError,
    onUpdateOptionStatus,
  } = useUpdateNotificationPreferences();

  const handleUpdateOption = useCallback(
    async (option: NotificationsOptionsType, isEnabled: boolean) =>
      onUpdateOptionStatus(option.type, isEnabled),
    [onUpdateOptionStatus]
  );

  const handleEnableNotificationsOnPress = useCallback(async () => {
    const accepted = await checkPushPermissionAndRegisterToken();

    if (!accepted) {
      triggerSkipNotificationPermission();
    }

    navigateOnboardingTo(Routes.BACKUP_EXPLANATION);
  }, [triggerSkipNotificationPermission, navigateOnboardingTo]);

  const handleSkipPress = useCallback(() => {
    triggerSkipNotificationPermission();
    navigateOnboardingTo(Routes.BACKUP_EXPLANATION);
  }, [triggerSkipNotificationPermission, navigateOnboardingTo]);

  return {
    options,
    isError,
    onUpdateOptionStatus,
    handleUpdateOption,
    handleEnableNotificationsOnPress,
    handleSkipPress,
  };
};
