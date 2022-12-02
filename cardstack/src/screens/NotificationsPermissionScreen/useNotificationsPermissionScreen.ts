import { useCallback } from 'react';

import { useUpdateNotificationPreferences } from '@cardstack/hooks/notifications-preferences/useUpdateNotificationPreferences';

export const useNotificationsPermissionScreen = () => {
  const {
    options,
    isError,
    // onUpdateOptionStatus,
  } = useUpdateNotificationPreferences();

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
