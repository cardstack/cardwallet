import { useCallback } from 'react';

import { useUpdateNotificationPreferences } from '@cardstack/hooks';
import { useShowOnboarding } from '@cardstack/hooks/onboarding/useShowOnboarding';
import { checkPushPermissionAndRegisterToken } from '@cardstack/models/firebase';
import { Routes } from '@cardstack/navigation';
import { usePersistedFlagsActions } from '@cardstack/redux/persistedFlagsSlice';

export const useNotificationsPermissionScreen = () => {
  const { navigateOnboardingTo } = useShowOnboarding();

  const { triggerSkipNotificationPermission } = usePersistedFlagsActions();

  const {
    options,
    isError,
    onUpdateOptionStatus,
  } = useUpdateNotificationPreferences();

  const handleSkipPress = useCallback(() => {
    triggerSkipNotificationPermission();
    navigateOnboardingTo(Routes.BACKUP_EXPLANATION);
  }, [triggerSkipNotificationPermission, navigateOnboardingTo]);

  const handleEnableNotificationsOnPress = useCallback(async () => {
    await checkPushPermissionAndRegisterToken();
    handleSkipPress();
  }, [handleSkipPress]);

  return {
    options,
    isError,
    onUpdateOptionStatus,
    handleEnableNotificationsOnPress,
    handleSkipPress,
  };
};
