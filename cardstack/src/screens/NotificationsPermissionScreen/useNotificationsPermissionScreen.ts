import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

import { useUpdateNotificationPreferences } from '@cardstack/hooks/notifications-preferences/useUpdateNotificationPreferences';
import { checkPushPermissionAndRegisterToken } from '@cardstack/models/firebase';
import { Routes } from '@cardstack/navigation';
import { NotificationsPreferenceDataType } from '@cardstack/types';

export const useNotificationsPermissionScreen = () => {
  const { navigate } = useNavigation();

  const {
    options,
    isError,
    onUpdateOptionStatus,
  } = useUpdateNotificationPreferences();

  const handleOnUpdateOption = useCallback(
    async (option: NotificationsPreferenceDataType, isEnabled: boolean) => {
      onUpdateOptionStatus(option.type, isEnabled);
    },
    [onUpdateOptionStatus]
  );

  const handleEnableNotificationsOnPress = useCallback(async () => {
    await checkPushPermissionAndRegisterToken();
    navigate(Routes.WALLET_SCREEN);
  }, [navigate]);

  return {
    options,
    isError,
    onUpdateOptionStatus,
    handleOnUpdateOption,
    handleEnableNotificationsOnPress,
  };
};
