import notifee from '@notifee/react-native';
import { merchantPrepaidCardPaymentReceivedHandler } from './merchantPrepaidCardPaymentReceived';
import { merchantClaimHandler } from './merchantClaim';
import logger from 'logger';
import { Network } from '@rainbow-me/helpers/networkTypes';

// add more notification types here
export enum NotificationType {
  customerPayment = 'customer_payment',
  merchantClaim = 'merchant_claim',
}

interface NotificationDataType {
  notificationType: NotificationType;
  transactionInformation?: string;
  network?: Network;
  ownerAddress?: string;
}

interface NotificationInfoType {
  data?: NotificationDataType;
  body: string;
}

interface LocalNotificationDataType {
  [key: string]: string;
}
interface LocalNotificationType {
  notification: { title?: string; body: string };
  data: LocalNotificationDataType;
}

interface NotificationConfig {
  title: string;
  handler: (data?: NotificationDataType) => void;
}

const notificationConfig: Record<NotificationType, NotificationConfig> = {
  [NotificationType.customerPayment]: {
    title: 'Payment Received',
    handler: data => {
      if (!data?.transactionInformation) return;
      // parse to object as hub sends data as a string
      const { transactionInformation } = data;
      const transactionData = JSON.parse(transactionInformation);
      merchantPrepaidCardPaymentReceivedHandler(transactionData);
    },
  },
  [NotificationType.merchantClaim]: {
    title: 'Merchant claimed successfully',
    handler: data => {
      logger.log('merchantClaim notif--', data);
      if (!data?.transactionInformation) return;
      // parse to object as hub sends data as a string
      const { transactionInformation } = data;
      const transactionData = JSON.parse(transactionInformation);
      merchantClaimHandler(transactionData);
    },
  },
};

export const notificationHandler = ({ data }: NotificationInfoType) => {
  const { notificationType } = data || {};

  if (data && notificationType) {
    notificationConfig?.[notificationType]?.handler(data);
  }
};

export const displayLocalNotification = async (
  notificationData: LocalNotificationType
) => {
  try {
    const {
      notification: { title, body },
      data,
    } = notificationData;

    const { notificationType } = data;

    // update notification title when no title from hub side(mostly had no title)
    const notificationTitle =
      title ||
      notificationConfig?.[notificationType as NotificationType]?.title;

    await notifee.displayNotification({
      title: notificationTitle,
      body,
      data,
    });
  } catch (e) {
    logger.sentry('Display LocalNotification failed - ', e);
  }
};
