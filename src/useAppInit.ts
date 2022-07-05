import notifee, { EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { useFlipper } from '@react-navigation/devtools';
import { useCallback, useEffect, useRef } from 'react';
import { Linking } from 'react-native';
import { useDispatch } from 'react-redux';
import handleDeepLink from './handlers/deeplinks';
import {
  runKeychainIntegrityChecks,
  runWalletBackupStatusChecks,
} from './handlers/walletReadyEvents';

import { useRainbowSelector } from './redux/hooks';
import store from './redux/store';
import { walletConnectLoadState } from './redux/walletconnect';
import { useAppRequirements, useAppState } from '@cardstack/hooks';
import { registerTokenRefreshListener } from '@cardstack/models/firebase';
import { Navigation, Routes } from '@cardstack/navigation';
import { navigationRef } from '@cardstack/navigation/Navigation';
import {
  displayLocalNotification,
  notificationHandler,
} from '@cardstack/notification-handler';
import { useAuthSelectorAndActions } from '@cardstack/redux/authSlice';
import { requestsForTopic } from '@cardstack/redux/requests';
import { Device } from '@cardstack/utils';

import Logger from 'logger';

const WALLETCONNECT_SYNC_DELAY = 500;
const ANDROID_UNAUTHORIZE_DELAY = 5000;

export const useAppInit = () => {
  const walletReady = useRainbowSelector(state => state.appState.walletReady);
  const appRequiments = useAppRequirements();

  const { justBecameActive, isInBackground } = useAppState();
  const {
    setUserUnauthorized,
    isAuthorized,
    hasWallet,
  } = useAuthSelectorAndActions();

  useDevSetup();
  useNotificationSetup();

  const initialDeepLink = useRef<string | null>(null);
  const androidLastAuthorizedDate = useRef<number | null>(null);

  useEffect(() => {
    const handleWcDeepLink = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();

        if (initialUrl) {
          initialDeepLink.current = initialUrl;

          handleDeepLink(initialUrl);
        }
      } catch (e) {
        Logger.sentry('Error opening deeplink', e);
      }
    };

    handleWcDeepLink();

    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return subscription.remove;
  }, []);

  useEffect(() => {
    if (initialDeepLink.current && isAuthorized) {
      Linking.openURL(initialDeepLink.current);

      initialDeepLink.current = null;
    }
  }, [isAuthorized]);

  useEffect(() => {
    if (walletReady) {
      Logger.sentry('✅ Wallet ready!');

      const unsubscribe = registerTokenRefreshListener();

      runKeychainIntegrityChecks();

      if (isAuthorized) {
        runWalletBackupStatusChecks();
      }

      return unsubscribe;
    }
  }, [isAuthorized, walletReady]);

  useEffect(() => {
    const currentDate = Date.now();

    if (isInBackground) {
      const tempAuthorizedRoutes: string[] = [
        Routes.QR_SCANNER_SCREEN,
        Routes.PAY_MERCHANT,
      ];

      const isOnDelayedRoute = tempAuthorizedRoutes.includes(
        Navigation.getActiveRouteName() || ''
      );

      if (Device.isAndroid && isOnDelayedRoute) {
        androidLastAuthorizedDate.current = currentDate;
        return;
      }

      androidLastAuthorizedDate.current = null;
      setUserUnauthorized();
    } else if (androidLastAuthorizedDate.current) {
      // When returning to active
      if (
        currentDate - androidLastAuthorizedDate.current >
        ANDROID_UNAUTHORIZE_DELAY
      ) {
        androidLastAuthorizedDate.current = null;
        setUserUnauthorized();
      }
    }
  }, [setUserUnauthorized, isInBackground]);

  useEffect(() => {
    if (!isAuthorized && hasWallet) {
      Navigation.handleAction(Routes.UNLOCK_SCREEN);
    }
  }, [hasWallet, isAuthorized]);

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

  useFlipper(navigationRef);
};

const useNotificationSetup = () => {
  const dispatch = useDispatch();

  const onRemoteNotification = useCallback(
    notification => {
      const topic = notification?.topic;
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
