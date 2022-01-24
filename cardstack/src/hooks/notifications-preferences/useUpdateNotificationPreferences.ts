import { useEffect, useCallback, useState } from 'react';
import { useAuthToken } from '@cardstack/hooks';

import { getFCMToken } from '@cardstack/models/firebase';
import {
  getNotificationsPreferences,
  setNotificationsPreferences,
} from '@cardstack/services/hub-service';
import { NotificationsPreferenceDataType } from '@cardstack/types';

export enum NotificationsOptionsStrings {
  'merchant_claim' = 'Merchant Claim',
  'customer_payment' = 'New Payment Received',
}

export const useUpdateNotificationPreferences = () => {
  const { authToken, isLoading, error } = useAuthToken();

  const [options, setOptions] = useState<
    NotificationsPreferenceDataType[] | undefined
  >([]);

  const fetchNotificationPreferences = useCallback(async () => {
    const { fcmToken } = await getFCMToken();

    if (fcmToken) {
      const result = await getNotificationsPreferences(authToken, fcmToken);

      if (result && result.length > 0) {
        setOptions(result);
      }
    }
  }, [authToken]);

  const onUpdateOptionStatus = useCallback(
    async (item, value) => {
      const updateList = options?.map(
        (option: NotificationsPreferenceDataType) => {
          if (
            option.attributes['notification-type'] ===
            item.attributes['notification-type']
          ) {
            option.attributes.status = value ? 'enabled' : 'disabled';
          }

          return option;
        }
      );

      setOptions(updateList);

      const updateItem = updateList?.find(
        o =>
          o.attributes['notification-type'] ===
          item.attributes['notification-type']
      );

      const { fcmToken } = await getFCMToken();

      if (fcmToken && authToken && updateItem) {
        await setNotificationsPreferences(authToken, fcmToken, updateItem);
      }
    },
    [authToken, options]
  );

  useEffect(() => {
    if (!isLoading && authToken) fetchNotificationPreferences();
  }, [authToken, isLoading, fetchNotificationPreferences]);

  return {
    options,
    onUpdateOptionStatus,
    error,
  };
};
