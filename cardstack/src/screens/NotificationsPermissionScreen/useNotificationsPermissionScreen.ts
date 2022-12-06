import { useCallback } from 'react';

import { useUpdateNotificationPreferences } from '@cardstack/hooks';

export const useNotificationsPermissionScreen = () => {
  const { options, isError } = useUpdateNotificationPreferences();

  const handleSkipOnPress = useCallback(() => {
    // TBD
  }, []);

  const handleEnableNotificationsOnPress = useCallback(() => {
    // TBD
  }, []);

  return {
    options,
    isError,
    handleSkipOnPress,
    handleEnableNotificationsOnPress,
  };
};
