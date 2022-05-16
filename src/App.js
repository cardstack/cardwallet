import { ApolloProvider } from '@apollo/client';
import notifee, { EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import * as Sentry from '@sentry/react-native';
import { ThemeProvider } from '@shopify/restyle';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  AppRegistry,
  AppState,
  Linking,
  LogBox,
  NativeModules,
  StatusBar,
  UIManager,
} from 'react-native';
import { SENTRY_ENDPOINT } from 'react-native-dotenv';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { connect, Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { name as appName } from '../app.json';
import { FlexItem } from './components/layout';
import { OfflineToast } from './components/toasts';
import {
  reactNativeDisableYellowBox,
  showNetworkRequests,
  showNetworkResponses,
} from './config/debug';
import { MainThemeProvider } from './context/ThemeContext';
import { InitialRouteContext } from './context/initialRoute';
import monitorNetwork from './debugging/network';
import handleDeepLink from './handlers/deeplinks';
import {
  runKeychainIntegrityChecks,
  runWalletBackupStatusChecks,
} from './handlers/walletReadyEvents';
import RainbowContextWrapper from './helpers/RainbowContext';
import { PinnedHiddenItemOptionProvider } from './hooks';

import { loadAddress } from './model/wallet';
import store, { persistor } from './redux/store';
import { walletConnectLoadState } from './redux/walletconnect';
import { AppRequirementsCheck } from '@cardstack/components/AppRequirementsCheck';
import ErrorBoundary from '@cardstack/components/ErrorBoundary/ErrorBoundary';
import { apolloClient } from '@cardstack/graphql/apollo-client';
import { registerTokenRefreshListener } from '@cardstack/models/firebase';
import { AppContainer, Routes } from '@cardstack/navigation';
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

class App extends Component {
  static propTypes = {
    requestsForTopic: PropTypes.func,
  };

  state = { appState: AppState.currentState, initialRoute: null };

  async componentDidMount() {
    if (__DEV__) {
      const RNAsyncStorageFlipper = require('rn-async-storage-flipper').default;
      const AsyncStorage = require('@react-native-async-storage/async-storage')
        .default;
      RNAsyncStorageFlipper(AsyncStorage);
    }

    if (!__DEV__ && NativeModules.RNTestFlight) {
      const { isTestFlight } = NativeModules.RNTestFlight.getConstants();
      Logger.sentry(`Test flight usage - ${isTestFlight}`);
    }

    this.identifyFlow();
    AppState.addEventListener('change', this.handleAppStateChange);

    this.foregroundNotificationListener = messaging().onMessage(
      this.onRemoteNotification
    );

    this.backgroundNotificationListener = messaging().setBackgroundMessageHandler(
      notificationHandler
    );

    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage) {
        notificationHandler(remoteMessage);
      }
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          notificationHandler(remoteMessage);
        }
      });

    notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        notificationHandler(detail.notification);
      }
    });

    // Handle direct WC deeplinks
    try {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink(initialUrl);
      }
    } catch (e) {
      Logger.log('Error opening deeplink', e);
    }
    Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.walletReady && this.props.walletReady) {
      // Everything we need to do after the wallet is ready goes here
      Logger.sentry('✅ Wallet ready!');
      this.onTokenRefreshListener = registerTokenRefreshListener();
      runKeychainIntegrityChecks();
      runWalletBackupStatusChecks();
    }
  }

  componentWillUnmount() {
    Logger.sentry('Unmount');
    AppState.removeEventListener('change', this.handleAppStateChange);
    this.onTokenRefreshListener?.();
    this.foregroundNotificationListener?.();
    this.backgroundNotificationListener?.();
  }

  identifyFlow = async () => {
    const address = await loadAddress();
    if (address) {
      this.setState({ initialRoute: Routes.TAB_NAVIGATOR });
    } else {
      this.setState({ initialRoute: Routes.WELCOME_SCREEN });
    }
  };

  onRemoteNotification = notification => {
    const topic = get(notification, 'topic');
    if (topic) {
      setTimeout(() => {
        const { requestsForTopic } = this.props;
        const requests = requestsForTopic(topic);
        if (requests && Array.isArray(requests) && requests.length > 0) {
          // WC requests will open automatically
          return false;
        }
        displayLocalNotification(notification);
      }, WALLETCONNECT_SYNC_DELAY);
    } else {
      displayLocalNotification(notification);
    }
  };

  handleAppStateChange = async nextAppState => {
    // Restore WC connectors when going from BG => FG
    if (this.state.appState === 'background' && nextAppState === 'active') {
      store.dispatch(walletConnectLoadState());
    }

    this.setState({ appState: nextAppState });

    Logger.sentry(`App state change to ${nextAppState}`);
  };

  render = () => (
    <MainThemeProvider>
      <RainbowContextWrapper>
        <Portal>
          <SafeAreaProvider>
            <PinnedHiddenItemOptionProvider>
              <ApolloProvider client={apolloClient}>
                <Provider store={store}>
                  <PersistGate loading={null} persistor={persistor}>
                    <FlexItem>
                      <AppRequirementsCheck>
                        {this.state.initialRoute && (
                          <InitialRouteContext.Provider
                            value={this.state.initialRoute}
                          >
                            <AppContainer />
                            <PortalConsumer />
                          </InitialRouteContext.Provider>
                        )}
                      </AppRequirementsCheck>
                      <OfflineToast />
                    </FlexItem>
                  </PersistGate>
                </Provider>
              </ApolloProvider>
            </PinnedHiddenItemOptionProvider>
          </SafeAreaProvider>
        </Portal>
      </RainbowContextWrapper>
    </MainThemeProvider>
  );
}

const AppWithRedux = connect(
  ({ appState: { walletReady } }) => ({ walletReady }),
  {
    requestsForTopic,
  }
)(App);

const AppWithStore = () => (
  <ThemeProvider theme={theme}>
    <ErrorBoundary>
      <AppWithRedux store={store} />
    </ErrorBoundary>
  </ThemeProvider>
);

AppRegistry.registerComponent(appName, () => AppWithStore);
