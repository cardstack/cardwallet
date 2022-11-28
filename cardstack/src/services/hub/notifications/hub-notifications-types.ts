export interface RegisterFCMTokenQueryParams {
  fcmToken: string;
}

type NotificationStatusType = 'disabled' | 'enabled';

export interface NotificationsPreferenceDataType {
  type: string;
  attributes: {
    status: NotificationStatusType;
    'owner-address': string;
    'push-client-id': string;
    'notification-type': string;
  };
}

export interface NotificationsPreferenceTypeStatusParam {
  notificationType: string;
  status: NotificationStatusType;
}
