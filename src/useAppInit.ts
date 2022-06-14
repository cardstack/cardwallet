import notifee, { EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { get } from 'lodash';
import { useCallback, useEffect } from 'react';
import { Linking } from 'react-native';
import { useDispatch } from 'react-redux';
import handleDeepLink from './handlers/deeplinks';
import {
  runKeychainIntegrityChecks,
  runWalletBackupStatusChecks,
} from './handlers/walletReadyEvents';
import { useAppState } from './hooks';

import { useRainbowSelector } from './redux/hooks';
import store from './redux/store';
import { walletConnectLoadState } from './redux/walletconnect';
import { useAppRequirements } from '@cardstack/components/AppRequirementsCheck';
import { registerTokenRefreshListener } from '@cardstack/models/firebase';
import {
  displayLocalNotification,
  notificationHandler,
} from '@cardstack/notification-handler';
import { requestsForTopic } from '@cardstack/redux/requests';
import Logger from 'logger';

const WALLETCONNECT_SYNC_DELAY = 500;

const skipKeychainCheck = true;

export const useAppInit = () => {
  const walletReady = useRainbowSelector(state => state.appState.walletReady);
  const appRequiments = useAppRequirements();

  const { justBecameActive } = useAppState();

  useDevSetup();
  useNotificationSetup();

  useEffect(() => {
    const handleWcDeepLink = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          handleDeepLink(initialUrl);
        }
      } catch (e) {
        Logger.log('Error opening deeplink', e);
      }
    };

    handleWcDeepLink();

    const unsubscribe = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (walletReady) {
      Logger.sentry('✅ Wallet ready!');

      const unsubscribe = registerTokenRefreshListener();

      if (!skipKeychainCheck) {
        runKeychainIntegrityChecks();
      }

      runWalletBackupStatusChecks();

      return unsubscribe;
    }
  }, [walletReady]);

  useEffect(() => {
    if (justBecameActive) {
      store.dispatch(walletConnectLoadState());
    }
  }, [justBecameActive]);

  return appRequiments;
};

const useDevSetup = () => {
  useEffect(() => {
    if (__DEV__) {
      const RNAsyncStorageFlipper = require('rn-async-storage-flipper').default;
      const AsyncStorage = require('@react-native-async-storage/async-storage')
        .default;
      RNAsyncStorageFlipper(AsyncStorage);
    }
  }, []);
};

const useNotificationSetup = () => {
  const dispatch = useDispatch();

  const onRemoteNotification = useCallback(
    notification => {
      const topic = get(notification, 'topic');
      if (topic) {
        setTimeout(() => {
          const requests = dispatch(requestsForTopic(topic));
          if (requests && Array.isArray(requests) && requests.length > 0) {
            // WC requests will open automatically
            return false;
          }
          displayLocalNotification(notification);
        }, WALLETCONNECT_SYNC_DELAY);
      } else {
        displayLocalNotification(notification);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const unsubscribe = messaging().onMessage(onRemoteNotification);
    return unsubscribe;
  }, [onRemoteNotification]);

  useEffect(() => {
    const unsubscribe = messaging().setBackgroundMessageHandler(
      notificationHandler
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    messaging().onNotificationOpenedApp(notificationHandler);

    // Check whether an initial notification is available
    messaging().getInitialNotification().then(notificationHandler);

    notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS && detail.notification) {
        notificationHandler(detail.notification);
      }
    });
  }, []);
};
