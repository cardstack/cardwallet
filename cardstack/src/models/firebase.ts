import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { requestNotifications } from 'react-native-permissions';

import {
  registerFcmToken,
  unregisterFcmToken,
} from '@cardstack/services/hub/notifications/hub-notifications-service';
import { NetworkType } from '@cardstack/types';

import { getNetwork } from '@rainbow-me/handlers/localstorage/globalSettings';
import { loadAddress } from '@rainbow-me/model/wallet';
import logger from 'logger';

import {
  saveSecureFCMToken,
  getSecureFCMToken,
  deleteSecureFCMToken,
} from './secure-storage';

export const getFCMToken = async (): Promise<string | undefined> => {
  const keyAddress = (await loadAddress()) || '';
  const keyNetwork: NetworkType = await getNetwork();

  const fcmToken = await getSecureFCMToken(keyAddress, keyNetwork);

  return fcmToken;
};

export const removeFCMToken = async () => {
  try {
    const fcmToken = await getFCMToken();

    if (fcmToken) {
      const response = await unregisterFcmToken();

      if ('data' in response) {
        logger.sentry('Unregistering FCM Token', response);

        const keyAddress = (await loadAddress()) || '';
        const keyNetwork: NetworkType = await getNetwork();
        await deleteSecureFCMToken(keyAddress, keyNetwork);
      }
    }
  } catch (e) {
    logger.sentry('Unregister FcmToken failed --', e);
  }
};

/**
 * The Push Token needs to be re-registered within each network, this function
 * validates if the device token is saved for current selected network,
 * if not we register it in the Hub and store the token locally
 * associated with the selected network.
 */
export const storeRegisteredFCMToken = async () => {
  try {
    const fcmToken = await getFCMToken();
    const newFcmToken = await messaging().getToken();

    if (fcmToken !== newFcmToken) {
      const { error } = await registerFcmToken(newFcmToken);

      if (error) throw error;

      const keyAddress = (await loadAddress()) || '';
      const keyNetwork: NetworkType = await getNetwork();

      await saveSecureFCMToken(newFcmToken, keyAddress, keyNetwork);

      logger.log('New FCM token now registered');
    } else {
      logger.log('FCM token already registered for this account');
    }
  } catch (error) {
    logger.sentry('Error trying to register FCM token', error);
  }
};

export const getPermissionStatus = (): Promise<FirebaseMessagingTypes.AuthorizationStatus> =>
  messaging().hasPermission();

export const needsNotificationPermission = async (): Promise<
  boolean | undefined
> => {
  try {
    const { DENIED, AUTHORIZED, PROVISIONAL } = messaging.AuthorizationStatus;

    const permissionStatus = await getPermissionStatus();

    const permissionStatusDefined = [DENIED, AUTHORIZED, PROVISIONAL].includes(
      permissionStatus
    );

    return !permissionStatusDefined;
  } catch (error) {
    logger.sentry(
      'Error checking if a user has push notifications permission',
      error
    );
  }
};

export const requestPermission = () =>
  new Promise((resolve, reject) => {
    requestNotifications(['alert', 'sound', 'badge'])
      .then(({ status }) => {
        resolve(status === 'granted');
      })
      .catch(e => reject(e));
  });

export const checkPushPermissionAndRegisterToken = async () => {
  if (await needsNotificationPermission()) {
    try {
      await requestPermission();
    } catch (error) {
      logger.sentry('User rejected push notifications permissions');
    }
  }

  await storeRegisteredFCMToken();
};

export const registerTokenRefreshListener = () =>
  messaging().onTokenRefresh(async fcmToken => {
    try {
      const walletAddress = (await loadAddress()) || '';

      const { error } = await registerFcmToken(fcmToken);

      if (error) throw error;

      const network = await getNetwork();
      await saveSecureFCMToken(fcmToken, walletAddress, network);
    } catch (error) {
      logger.sentry(
        'Error on registerTokenRefreshListener, cannot register refreshed fcm token',
        error
      );
    }
  });
