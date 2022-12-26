import notifee, {
  AndroidImportance,
  Notification,
} from '@notifee/react-native';

import { NetworkType } from '@cardstack/types';

import { getNetwork } from '@rainbow-me/handlers/localstorage/globalSettings';
import { loadAddress } from '@rainbow-me/model/wallet';
import logger from 'logger';

import { merchantClaimHandler } from './merchantClaim';
import { merchantPrepaidCardPaymentReceivedHandler } from './merchantPrepaidCardPaymentReceived';

// add more notification types here
export enum NotificationType {
  customerPayment = 'customer_payment',
  merchantClaim = 'merchant_claim',
}

interface NotificationDataType {
  notificationType: NotificationType;
  transactionInformation?: string;
  network?: NetworkType;
  ownerAddress?: string;
}

interface LocalNotificationDataType {
  [key: string]: string;
}
interface LocalNotificationType {
  notification: { title?: string; body: string };
  data?: LocalNotificationDataType;
  isManualNotification?: boolean;
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
    title: 'Balance claimed successfully',
    handler: data => {
      if (!data?.transactionInformation) return;
      // parse to object as hub sends data as a string
      const { transactionInformation } = data;
      const transactionData = JSON.parse(transactionInformation);
      merchantClaimHandler(transactionData);
    },
  },
};

export const notificationHandler = async (message: Notification | null) => {
  if (!message?.data) {
    return;
  }

  const { data } = message;

  if (data?.notificationType && data.network && data.ownerAddress) {
    const currentNetwork = await getNetwork();
    const address = await loadAddress();

    const isNotificationTypeValid = Object.values(NotificationType).includes(
      data?.notificationType as NotificationType
    );

    // Checks if notificationType is a valid value, then casts the type
    if (isNotificationTypeValid) {
      const typedData = (data as unknown) as NotificationDataType;

      const { notificationType, network, ownerAddress } = typedData;

      // handle notification in same network only
      if (currentNetwork === network) {
        if (address === ownerAddress) {
          notificationConfig?.[notificationType]?.handler(typedData);
        } else {
          // if different EOA with notification address, switch account to correct one and then handle notification
        }
      }
    }
  }
};

export const displayLocalNotification = async (
  notificationData: LocalNotificationType
) => {
  try {
    const {
      notification: { title, body },
      data,
      isManualNotification,
    } = notificationData;

    const { notificationType, network } = data || {};
    const currentNetwork = await getNetwork();

    // show local notification in same network only
    if (network === currentNetwork || isManualNotification) {
      // update notification title when no title from hub side(mostly had no title)
      const notificationTitle =
        title ||
        notificationConfig?.[notificationType as NotificationType]?.title;

      // A channel is required on Android for displaying local notifications.
      // The default channel can't have custom 'importance'.
      const channelId = await notifee.createChannel({
        id: isManualNotification ? 'ManualLocalNotification' : notificationType,
        name: notificationTitle,
        importance: AndroidImportance.HIGH,
      });

      await notifee.displayNotification({
        title: notificationTitle,
        body,
        data,
        android: {
          channelId,
        },
      });
    }
  } catch (e) {
    logger.sentry('Display LocalNotification failed - ', e);
  }
};
