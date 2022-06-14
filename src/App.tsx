import { ApolloProvider } from '@apollo/client';
import notifee, { EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import * as Sentry from '@sentry/react-native';
import { ThemeProvider } from '@shopify/restyle';
import { get } from 'lodash';
import React, { useCallback, useEffect } from 'react';
import {
  AppRegistry,
  Linking,
  LogBox,
  StatusBar,
  UIManager,
} from 'react-native';
import { SENTRY_ENDPOINT } from 'react-native-dotenv';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { name as appName } from '../app.json';
import { OfflineToast } from './components/toasts';
import {
  reactNativeDisableYellowBox,
  showNetworkRequests,
  showNetworkResponses,
} from './config/debug';
import { MainThemeProvider } from './context/ThemeContext';
import monitorNetwork from './debugging/network';
import handleDeepLink from './handlers/deeplinks';
import {
  runKeychainIntegrityChecks,
  runWalletBackupStatusChecks,
} from './handlers/walletReadyEvents';
import { PinnedHiddenItemOptionProvider, useAppState } from './hooks';

import { useRainbowSelector } from './redux/hooks';
import store, { persistor } from './redux/store';
import { walletConnectLoadState } from './redux/walletconnect';
import MaintenanceMode from './screens/MaintenanceMode';
import { useAppRequirements } from '@cardstack/components/AppRequirementsCheck';
import ErrorBoundary from '@cardstack/components/ErrorBoundary/ErrorBoundary';
import { MinimumVersion } from '@cardstack/components/MinimumVersion';
import { apolloClient } from '@cardstack/graphql/apollo-client';
import { registerTokenRefreshListener } from '@cardstack/models/firebase';
import { AppContainer } from '@cardstack/navigation';
import {
  displayLocalNotification,
  notificationHandler,
} from '@cardstack/notification-handler';
import { requestsForTopic } from '@cardstack/redux/requests';
import theme from '@cardstack/theme';
import { Device } from '@cardstack/utils';
import PortalConsumer from '@rainbow-me/components/PortalConsumer';
import Logger from 'logger';
import { Portal } from 'react-native-cool-modals/Portal';

const WALLETCONNECT_SYNC_DELAY = 500;

const skipKeychainCheck = true;

StatusBar.pushStackEntry({ animated: true, barStyle: 'light-content' });

if (__DEV__) {
  reactNativeDisableYellowBox && LogBox.ignoreAllLogs();
  (showNetworkRequests || showNetworkResponses) &&
    monitorNetwork(showNetworkRequests, showNetworkResponses);
} else {
  Sentry.init({
    dsn: SENTRY_ENDPOINT,
    enableAutoSessionTracking: true,
    // Allowed number of char on breadcrumbs
    maxValueLength: 8000,
    maxBreadcrumbs: 100,
    normalizeDepth: 10,
  });
}

enableScreens();

if (Device.isAndroid) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

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

const useAppInit = () => {
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

const App = () => {
  const { forceUpdate, maintenance } = useAppInit();

  if (maintenance.active) {
    return <MaintenanceMode message={maintenance.message} />;
  }

  if (forceUpdate) {
    return <MinimumVersion />;
  }

  return (
    <MainThemeProvider>
      <Portal>
        <SafeAreaProvider>
          <PinnedHiddenItemOptionProvider>
            <AppContainer />
            <PortalConsumer />
            <OfflineToast />
          </PinnedHiddenItemOptionProvider>
        </SafeAreaProvider>
      </Portal>
    </MainThemeProvider>
  );
};

const AppWithStore = () => (
  <ThemeProvider theme={theme}>
    <ErrorBoundary>
      <ApolloProvider client={apolloClient}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </ApolloProvider>
    </ErrorBoundary>
  </ThemeProvider>
);

AppRegistry.registerComponent(appName, () => AppWithStore);
