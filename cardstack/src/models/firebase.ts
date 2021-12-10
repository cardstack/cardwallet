import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import lang from 'i18n-js';
import { get } from 'lodash';
import { requestNotifications } from 'react-native-permissions';
import { registerFcmToken } from '@cardstack/services/hub-service';
import { Alert } from '@rainbow-me/components/alerts';
import { getLocal, saveLocal } from '@rainbow-me/handlers/localstorage/common';
import { loadAddress } from '@rainbow-me/model/wallet';
import logger from 'logger';

const DEVICE_FCM_TOKEN_KEY = 'cardwalletFcmToken';

const getPermissionStatus = (): Promise<FirebaseMessagingTypes.AuthorizationStatus> =>
  messaging().hasPermission();

export const getFCMToken = async (): Promise<{
  fcmToken: string | null;
  addresses: string[];
}> => {
  const fcmTokenLocal = await getLocal(DEVICE_FCM_TOKEN_KEY);

  const fcmToken: string = get(fcmTokenLocal, 'data', null);

  if (!fcmToken) {
    return { fcmToken: null, addresses: [] };
  }

  const addresses: string[] = get(fcmTokenLocal, 'addresses', []);
  return { fcmToken, addresses };
};

// check if token's stored by confirming addresses includes wallet address
export const isFCMTokenStored = async (
  walletAddress: string
): Promise<{
  isTokenStored: boolean;
  addresses: string[];
  fcmToken: string | null;
}> => {
  const { fcmToken, addresses } = await getFCMToken();
  return {
    isTokenStored: !!fcmToken && addresses.includes(walletAddress),
    fcmToken,
    addresses,
  };
};

// check if token is registered in hub with checking stored in asyncStorage associated with wallet address
// and if not stored, register to hub, then update asyncStorage)
export const saveFCMToken = async (
  walletAddress: string,
  seedPhrase?: string
) => {
  try {
    const { isTokenStored, addresses, fcmToken } = await isFCMTokenStored(
      walletAddress
    );

    if (!isTokenStored) {
      const newFcmToken = await messaging().getToken();

      const registeredRespose = await registerFcmToken(
        newFcmToken,
        walletAddress,
        seedPhrase
      );

      if (registeredRespose) {
        // if newFcmToken is same as old stored one, then add wallet address to asyncStorage,
        // otherwise replace addresses value with [walletAddress] so can be replaced in next app load on other accounts
        if (fcmToken !== newFcmToken) {
          saveLocal(DEVICE_FCM_TOKEN_KEY, {
            data: newFcmToken,
            addresses: [walletAddress],
          });
        } else {
          saveLocal(DEVICE_FCM_TOKEN_KEY, {
            data: newFcmToken,
            addresses: [...addresses, walletAddress].filter(
              (address, index, self) => self.indexOf(address) === index // remove duplicates
            ),
          });
        }

        logger.log('FCM token registered');

        return;
      }

      logger.sentry('FCM token register failed', walletAddress);
    } else {
      logger.sentry('FCM token already registered for this account!');
    }
  } catch (error) {
    logger.sentry('error fcm token - cannot register fcm token', error);
  }
};

export const requestPermission = () => {
  return new Promise((resolve, reject) => {
    requestNotifications(['alert', 'sound', 'badge'])
      .then(({ status }) => {
        resolve(status === 'granted');
      })
      .catch(e => reject(e));
  });
};

export const checkPushPermissionAndRegisterToken = async (
  walletAddress: string,
  seedPhrase?: string
) => {
  return new Promise(async resolve => {
    let permissionStatus = null;

    try {
      permissionStatus = await getPermissionStatus();
    } catch (error) {
      logger.sentry(
        'Error checking if a user has push notifications permission',
        error
      );
    }

    if (
      permissionStatus !== messaging.AuthorizationStatus.AUTHORIZED &&
      permissionStatus !== messaging.AuthorizationStatus.PROVISIONAL
    ) {
      Alert({
        buttons: [
          {
            onPress: async () => {
              try {
                await requestPermission();
                await saveFCMToken(walletAddress, seedPhrase);
              } catch (error) {
                logger.sentry('User rejected push notifications permissions');
              } finally {
                resolve(true);
              }
            },
            text: 'Okay',
          },
          {
            onPress: async () => {
              resolve(true);
            },
            style: 'cancel',
            text: 'Dismiss',
          },
        ],
        message: lang.t('wallet.push_notifications.please_enable_body'),
        title: lang.t('wallet.push_notifications.please_enable_title'),
      });
    } else {
      await saveFCMToken(walletAddress, seedPhrase);
      resolve(true);
    }
  });
};

export const registerTokenRefreshListener = () =>
  messaging().onTokenRefresh(async fcmToken => {
    try {
      const tokenRegisterResponse = await registerFcmToken(fcmToken);

      if (tokenRegisterResponse) {
        const walletAddress = (await loadAddress()) || '';
        saveLocal(DEVICE_FCM_TOKEN_KEY, {
          data: fcmToken,
          addresses: [walletAddress],
        });
      }
    } catch (error) {
      logger.sentry(
        'registerTokenRefreshListener - cannot register refreshed fcm token',
        error
      );
    }
  });
