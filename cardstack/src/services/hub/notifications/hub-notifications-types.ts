import { NotificationStatusType } from '@cardstack/types';

export interface RegisterFCMTokenQueryParams {
  fcmToken: string;
}

export interface NotificationsPreferenceTypeStatusParam {
  notificationType: string;
  status: NotificationStatusType;
}
