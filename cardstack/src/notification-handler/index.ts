import { merchantPrepaidCardPaymentReceivedHandler } from './merchantPrepaidCardPaymentReceived';

// add more notification types here
export enum NotificationType {
  'customer_payment' = 'customer_payment',
}

type NotificationDataType = {
  notificationType: NotificationType;
  transactionInformation: string;
};

export const notificationHandler = (data: NotificationDataType) => {
  const { notificationType, transactionInformation } = data;
  const transactionData = JSON.parse(transactionInformation); // parse to object as hub sends data as a string

  switch (notificationType) {
    case NotificationType.customer_payment:
      merchantPrepaidCardPaymentReceivedHandler(transactionData);
      break;
  }
};
