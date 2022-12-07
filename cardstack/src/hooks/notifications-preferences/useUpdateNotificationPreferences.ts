import { useCallback } from 'react';

import {
  useGetNotificationsPreferencesQuery,
  useSetNotificationsPreferencesMutation,
} from '@cardstack/services/hub/notifications/hub-notifications-api';

export const useUpdateNotificationPreferences = () => {
  const { data: options = [], isError } = useGetNotificationsPreferencesQuery();

  const [
    setNotificationsPreferences,
  ] = useSetNotificationsPreferencesMutation();

  const onUpdateOptionStatus = useCallback(
    async (notificationType: string, isEnabled: boolean) => {
      await setNotificationsPreferences({
        notificationType,
        status: isEnabled ? 'enabled' : 'disabled',
      });
    },
    [setNotificationsPreferences]
  );

  return {
    options,
    onUpdateOptionStatus,
    isError,
  };
};
