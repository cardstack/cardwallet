import { useCallback } from 'react';

import {
  useGetNotificationsPreferencesQuery,
  useSetNotificationsPreferencesMutation,
} from '@cardstack/services/hub/notifications/hub-notifications-api';

export enum NotificationsOptionsStrings {
  'merchant_claim' = 'Merchant Claim',
  'customer_payment' = 'New Payment Received',
  'prepaid_card_drop' = 'Prepaid Card Drop',
}

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
