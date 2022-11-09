import notifee, { EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { useFlipper } from '@react-navigation/devtools';
import { useCallback, useEffect, useRef } from 'react';
import { Linking } from 'react-native';
import { useDispatch } from 'react-redux';
import handleWcDeepLink from './handlers/deeplinks';
import { runKeychainIntegrityChecks } from './handlers/walletReadyEvents';

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

import logger from 'logger';

const WALLETCONNECT_SYNC_DELAY = 500;

export const useAppInit = () => {
  const walletReady = useRainbowSelector(state => state.appState.walletReady);
  const appRequirements = useAppRequirements();

  const { justBecameActive, movedFromBackground } = useAppState();

  const {
    setUserUnauthorized,
    isAuthorized,
    hasWallet,
    isAuthenticatingWithBiometrics,
  } = useAuthSelectorAndActions();

  useDevSetup();
  useNotificationSetup();

  const deepLink = useRef<{ url: string | null; handled: boolean }>({
    url: null,
    handled: false,
  });

  const handleDeepLink = useCallback((url: string) => {
    deepLink.current = { url, handled: false };

    handleWcDeepLink(url);
  }, []);

  useEffect(() => {
    const handleInitialLink = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();

        if (initialUrl) {
          handleDeepLink(initialUrl);
        }
      } catch (e) {
        logger.sentry('Error opening initial deeplink', e);
      }
    };

    handleInitialLink();

    const subscription = Linking.addEventListener('url', ({ url }) => {
      // Check to avoid reopening same link when `openURL` is triggered
      if (deepLink.current.handled && deepLink.current.url === url) {
        return;
      }

      handleDeepLink(url);
    });

    return subscription.remove;
  }, [handleDeepLink]);

  useEffect(() => {
    const { url, handled } = deepLink.current;

    if (url && !handled && isAuthorized) {
      Navigation.linkTo(url);

      deepLink.current = { url, handled: true };
    }
  }, [isAuthorized]);

  useEffect(() => {
    if (walletReady) {
      logger.sentry('✅ Wallet ready!');

      const unsubscribe = registerTokenRefreshListener();

      if (isAuthorized) {
        runKeychainIntegrityChecks();
      }

      return unsubscribe;
    }
  }, [isAuthorized, walletReady]);

  useEffect(() => {
    const isNotAlreadyLocked =
      Navigation.getActiveRouteName() !== Routes.UNLOCK_SCREEN;

    // We can't use justBecameActive it loops iOS biometrics active->inactive->active
    if (
      movedFromBackground &&
      isNotAlreadyLocked &&
      !isAuthenticatingWithBiometrics
    ) {
      setUserUnauthorized();
    }
  }, [
    isAuthenticatingWithBiometrics,
    movedFromBackground,
    setUserUnauthorized,
  ]);

  useEffect(() => {
    if (!isAuthorized && hasWallet) {
      Navigation.handleAction(Routes.UNLOCK_SCREEN);
    }
    // movedFromBackground is used to re-run this effect
    // in case the other deps are still the same and
    // navigation wasn't triggered
  }, [hasWallet, isAuthorized, movedFromBackground]);

  useEffect(() => {
    if (justBecameActive) {
      store.dispatch(walletConnectLoadState());
    }
  }, [justBecameActive]);

  return appRequirements;
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
