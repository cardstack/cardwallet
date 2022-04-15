import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import lang from 'i18n-js';
import { requestNotifications } from 'react-native-permissions';

import {
  registerFcmToken,
  unregisterFcmToken,
} from '@cardstack/services/hub-service';

import { Alert } from '@rainbow-me/components/alerts';
import { getLocal, saveLocal } from '@rainbow-me/handlers/localstorage/common';
import { getNetwork } from '@rainbow-me/handlers/localstorage/globalSettings';
import { Network } from '@rainbow-me/helpers/networkTypes';
import { loadAddress } from '@rainbow-me/model/wallet';
import logger from 'logger';

const DEVICE_FCM_TOKEN_KEY = 'cardwalletFcmToken';
type FCMTokenStorageType = {
  fcmToken: string | null;
  addressesByNetwork?: Record<Network, string[]>;
};

const getPermissionStatus = (): Promise<FirebaseMessagingTypes.AuthorizationStatus> =>
  messaging().hasPermission();

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
    const network: Network = await getNetwork();
    const { fcmToken, addressesByNetwork } = await getFCMToken();

    if (
      fcmToken &&
      addressesByNetwork &&
      addressesByNetwork[network] &&
      addressesByNetwork[network].includes(address)
    ) {
      const unregisterResponse = await unregisterFcmToken(fcmToken, address);

      logger.sentry('UnregisterFcmToken response ---', unregisterResponse);

      if (unregisterResponse?.success) {
        // remove address from AsyncStorage for all networks
        for (const networkName in addressesByNetwork) {
          addressesByNetwork[networkName as Network] = addressesByNetwork[
            networkName as Network
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
  addressesByNetwork?: Record<Network, string[]>;
  fcmToken: string | null;
}

// check if token's stored by confirming addresses includes wallet address
export const isFCMTokenStored = async (
  walletAddress: string
): Promise<isFCMTokenStoredProps> => {
  const { fcmToken, addressesByNetwork } = await getFCMToken();
  const network: Network = await getNetwork();
  return {
    isTokenStored:
      !!fcmToken &&
      (addressesByNetwork?.[network] || []).includes(walletAddress),
    fcmToken,
    addressesByNetwork,
  };
};

// check if token is registered in hub with checking stored in asyncStorage associated with wallet address
// and if not stored, register to hub, then update asyncStorage)
export const saveFCMToken = async (
  walletAddress: string,
  seedPhrase?: string
) => {
  try {
    const {
      isTokenStored,
      addressesByNetwork,
      fcmToken,
    } = await isFCMTokenStored(walletAddress);

    if (!isTokenStored) {
      const newFcmToken = await messaging().getToken();

      const registeredRespose = await registerFcmToken(
        newFcmToken,
        walletAddress,
        seedPhrase
      );

      if (registeredRespose?.success) {
        const network: Network = await getNetwork();

        // if newFcmToken is same as old stored one, then add wallet address to asyncStorage,
        // otherwise replace addresses value with [walletAddress] so can be replaced in next app load on other accounts
        if (fcmToken !== newFcmToken) {
          saveLocal(DEVICE_FCM_TOKEN_KEY, {
            data: { fcmToken: newFcmToken, [network]: [walletAddress] },
          });
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
        }

        logger.log('FCM token registered!!!');

        return;
      }

      logger.sentry('FCM token register failed!', walletAddress);
    } else {
      logger.sentry('FCM token already registered for this account!');
    }
  } catch (error) {
    logger.sentry('error fcm token - cannot register fcm token!', error);
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
      const walletAddress = (await loadAddress()) || '';

      const tokenRegisterResponse = await registerFcmToken(
        fcmToken,
        walletAddress
      );

      if (tokenRegisterResponse?.success) {
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
