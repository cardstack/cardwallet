import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { requestNotifications } from 'react-native-permissions';

import {
  registerFcmToken,
  unregisterFcmToken,
} from '@cardstack/services/hub/notifications/hub-notifications-service';
import { NetworkType } from '@cardstack/types';

import { getLocal, saveLocal } from '@rainbow-me/handlers/localstorage/common';
import { getNetwork } from '@rainbow-me/handlers/localstorage/globalSettings';
import { loadAddress } from '@rainbow-me/model/wallet';
import logger from 'logger';

const DEVICE_FCM_TOKEN_KEY = 'cardwalletFcmToken';
type FCMTokenStorageType = {
  fcmToken: string | null;
  addressesByNetwork?: Record<NetworkType, string[]>;
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

export const getFCMToken = async (): Promise<FCMTokenStorageType> => {
  try {
    const {
      data: { fcmToken, ...addressesByNetwork },
    } = ((await getLocal(DEVICE_FCM_TOKEN_KEY)) || {
      data: { fcmToken: null },
    }) as any;

    if (!fcmToken) {
      return { fcmToken: null };
    }

    return { fcmToken, addressesByNetwork };
  } catch {
    return { fcmToken: null };
  }
};

export const removeFCMToken = async (address: string) => {
  try {
    const network: NetworkType = await getNetwork();
    const { fcmToken, addressesByNetwork } = await getFCMToken();

    if (
      fcmToken &&
      addressesByNetwork &&
      addressesByNetwork[network] &&
      addressesByNetwork[network].includes(address)
    ) {
      const response = await unregisterFcmToken();

      if ('data' in response) {
        logger.sentry('Unregistering FCM Token', response);

        // remove address from AsyncStorage for all networks
        for (const networkName in addressesByNetwork) {
          addressesByNetwork[networkName as NetworkType] = addressesByNetwork[
            networkName as NetworkType
          ].filter((addr: string) => addr !== address);
        }

        await saveLocal(DEVICE_FCM_TOKEN_KEY, {
          data: {
            ...addressesByNetwork,
            fcmToken,
          },
        });
      }
    }
  } catch (e) {
    logger.sentry('Unregister FcmToken failed --', e);
  }
};

interface isFCMTokenStoredProps {
  isTokenStored: boolean;
  addressesByNetwork?: Record<NetworkType, string[]>;
  fcmToken: string | null;
}

// check if token's stored by confirming addresses includes wallet address
export const isFCMTokenStored = async (
  walletAddress: string
): Promise<isFCMTokenStoredProps> => {
  const { fcmToken, addressesByNetwork } = await getFCMToken();
  const network: NetworkType = await getNetwork();
  return {
    isTokenStored:
      !!fcmToken &&
      (addressesByNetwork?.[network] || []).includes(walletAddress),
    fcmToken,
    addressesByNetwork,
  };
};

/**
 * The Push Token needs to be re-registered within each network, this function
 * validates if the device token is saved for current selected network,
 * if not we register it in the Hub and store the token locally
 * associated with the selected network.
 */
export const registerFCMToken = async () => {
  try {
    const walletAddress = (await loadAddress()) || '';

    const {
      isTokenStored,
      addressesByNetwork,
      fcmToken,
    } = await isFCMTokenStored(walletAddress);

    if (!isTokenStored) {
      const newFcmToken = await messaging().getToken();

      const { error } = await registerFcmToken(newFcmToken);

      if (!error) {
        const network: NetworkType = await getNetwork();

        // if newFcmToken is same as old stored one, then add wallet address to asyncStorage,
        // otherwise replace addresses value with [walletAddress] so can be replaced in next app load on other accounts
        if (fcmToken !== newFcmToken) {
          saveLocal(DEVICE_FCM_TOKEN_KEY, {
            data: { fcmToken: newFcmToken, [network]: [walletAddress] },
          });

          logger.log('FCM token changed and was registered for', network);
        } else {
          saveLocal(DEVICE_FCM_TOKEN_KEY, {
            data: {
              fcmToken: newFcmToken,
              ...addressesByNetwork,
              [network]: [
                ...(addressesByNetwork?.[network] || []),
                walletAddress,
              ].filter(
                (address, index, self) => self.indexOf(address) === index // remove duplicates
              ),
            },
          });

          logger.log('FCM token registered for', network);
        }

        return;
      }

      logger.sentry('FCM token register failed!', walletAddress);
    } else {
      logger.log('FCM token already registered for this account');
    }
  } catch (error) {
    logger.sentry('Error trying to register FCM token', error);
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

  await registerFCMToken();
};

export const registerTokenRefreshListener = () =>
  messaging().onTokenRefresh(async fcmToken => {
    try {
      const walletAddress = (await loadAddress()) || '';

      const { data } = await registerFcmToken(fcmToken);

      if (data) {
        const network = await getNetwork();
        saveLocal(DEVICE_FCM_TOKEN_KEY, {
          data: { fcmToken, [network]: [walletAddress] },
        });
      }
    } catch (error) {
      logger.sentry(
        'registerTokenRefreshListener - cannot register refreshed fcm token',
        error
      );
    }
  });
