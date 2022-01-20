import notifee from '@notifee/react-native';
import { merchantPrepaidCardPaymentReceivedHandler } from './merchantPrepaidCardPaymentReceived';
import logger from 'logger';

// add more notification types here
export enum NotificationType {
  'customer_payment' = 'customer_payment',
  'merchant_claim' = 'merchant_claim',
}

interface NotificationDataType {
  notificationType: NotificationType;
  transactionInformation: string;
}

interface NotificationInfoType {
  data: NotificationDataType;
  body: string;
}

export const notificationHandler = ({ data }: NotificationInfoType) => {
  const { notificationType } = data;

  if (notificationType) {
    switch (notificationType) {
      case NotificationType.customer_payment:
        const { transactionInformation } = data;
        const transactionData = JSON.parse(transactionInformation); // parse to object as hub sends data as a string
        merchantPrepaidCardPaymentReceivedHandler(transactionData);
        break;
    }
  }
};

export const displayLocalNotification = async (notificationData: any) => {
  try {
    const {
      notification: { title, body },
      data,
    } = notificationData;

    let notificationTitle = title;
    const { notificationType } = data;

    // update notification title when no title from hub side(mostly had no title)
    if (
      !notificationTitle &&
      notificationType === NotificationType.customer_payment
    ) {
      notificationTitle = 'Payment Received';
    }

    await notifee.displayNotification({
      title: notificationTitle,
      body,
      data,
    });
  } catch (e) {
    logger.sentry('Display LocalNotification failed - ', e);
  }
};
