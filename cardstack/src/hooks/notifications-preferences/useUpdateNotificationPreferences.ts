import { useCallback } from 'react';

import {
  useGetNotificationsPreferencesQuery,
  useSetNotificationsPreferencesMutation,
} from '@cardstack/services/hub/notifications/hub-notifications-api';
import { NotificationsPreferenceDataType } from '@cardstack/types';

export enum NotificationsOptionsStrings {
  'merchant_claim' = 'Merchant Claim',
  'customer_payment' = 'New Payment Received',
  'prepaid_card_drop' = 'Prepaid Card Drop',
}

export const useUpdateNotificationPreferences = () => {
  const {
    data: options = [],
    error: getError,
  } = useGetNotificationsPreferencesQuery();

  const [
    setNotificationsPreferences,
  ] = useSetNotificationsPreferencesMutation();

  const onUpdateOptionStatus = useCallback(
    async (item: NotificationsPreferenceDataType, value: boolean) => {
      await setNotificationsPreferences({
        notificationType: item.attributes['notification-type'],
        status: value ? 'enabled' : 'disabled',
      });
    },
    [setNotificationsPreferences]
  );

  return {
    options,
    onUpdateOptionStatus,
    error: getError && 'Failed to get notificition preferences',
  };
};
