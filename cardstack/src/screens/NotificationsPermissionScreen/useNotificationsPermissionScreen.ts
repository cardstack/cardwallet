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

  const handleEnableNotificationsOnPress = useCallback(async () => {
    await checkPushPermissionAndRegisterToken();

    navigateOnboardingTo(Routes.BACKUP_EXPLANATION);
  }, [navigateOnboardingTo]);

  const handleSkipPress = useCallback(() => {
    triggerSkipNotificationPermission();
    navigateOnboardingTo(Routes.BACKUP_EXPLANATION);
  }, [triggerSkipNotificationPermission, navigateOnboardingTo]);

  return {
    options,
    isError,
    onUpdateOptionStatus,
    handleEnableNotificationsOnPress,
    handleSkipPress,
  };
};
