export type NotificationStatusType = 'disabled' | 'enabled';

export enum NotificationsOptionsStrings {
  'merchant_claim' = 'Merchant Claim',
  'customer_payment' = 'New Payment Received',
  'prepaid_card_drop' = 'Prepaid Card Drop',
}

export interface NotificationsOptionsType {
  type: keyof typeof NotificationsOptionsStrings;
  description: string;
  status: NotificationStatusType;
}

export interface NotificationsPreferenceRawDataType {
  type: string;
  attributes: {
    status: NotificationStatusType;
    'owner-address': string;
    'push-client-id': string;
    'notification-type': string;
  };
}
