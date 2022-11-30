export type NotificationStatusType = 'disabled' | 'enabled';

export interface NotificationsPreferenceDataType {
  type: string;
  attributes: {
    status: NotificationStatusType;
    'owner-address': string;
    'push-client-id': string;
    'notification-type': string;
  };
}
