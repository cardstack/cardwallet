import { useCallback } from 'react';

export const useNotificationsPermissionScreen = () => {
  const handleSkipOnPress = useCallback(() => {
    // TBD
  }, []);

  const handleEnableNotificationsOnPress = useCallback(() => {
    // TBD
  }, []);

  return {
    handleSkipOnPress,
    handleEnableNotificationsOnPress,
  };
};
