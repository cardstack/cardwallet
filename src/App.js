import { ApolloProvider } from '@apollo/client';
import messaging from '@react-native-firebase/messaging';
import * as Sentry from '@sentry/react-native';
import { ThemeProvider } from '@shopify/restyle';
import compareVersions from 'compare-versions';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component, useEffect } from 'react';
import {
  AppRegistry,
  AppState,
  Linking,
  LogBox,
  NativeModules,
  StatusBar,
} from 'react-native';
import { SENTRY_ENDPOINT } from 'react-native-dotenv';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import VersionNumber from 'react-native-version-number';
import { connect, Provider } from 'react-redux';
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

import useHideSplashScreen from './hooks/useHideSplashScreen';
import { registerTokenRefreshListener, saveFCMToken } from './model/firebase';
import { loadAddress } from './model/wallet';
import { Navigation } from './navigation';
import RoutesComponent from './navigation/Routes';
import { requestsForTopic } from './redux/requests';
import store from './redux/store';
import { walletConnectLoadState } from './redux/walletconnect';
import MaintenanceMode from './screens/MaintenanceMode';
import ErrorBoundary from '@cardstack/components/ErrorBoundary/ErrorBoundary';
import PortalConsumer from '@cardstack/components/LoadingOverlay/PortalConsumer';
import { MinimumVersion } from '@cardstack/components/MinimumVersion';
import { apolloClient } from '@cardstack/graphql/apollo-client';
import { getMaintenanceStatus, getMinimumVersion } from '@cardstack/services';
import theme from '@cardstack/theme';
import Routes from '@rainbow-me/routes';
import Logger from 'logger';
import { Portal } from 'react-native-cool-modals/Portal';

const WALLETCONNECT_SYNC_DELAY = 500;

StatusBar.pushStackEntry({ animated: true, barStyle: 'light-content' });

if (__DEV__) {
  reactNativeDisableYellowBox && LogBox.ignoreAllLogs();
  (showNetworkRequests || showNetworkResponses) &&
    monitorNetwork(showNetworkRequests, showNetworkResponses);
} else {
  let sentryOptions = {
    dsn: SENTRY_ENDPOINT,
    enableAutoSessionTracking: true,
    // environment: SENTRY_ENVIRONMENT,
    release: `me.rainbow-${VersionNumber.appVersion}`,
  };

  if (android) {
    const dist = VersionNumber.buildVersion;
    // In order for sourcemaps to work on android,
    // the release needs to be named with the following format
    // me.rainbow@1.0+4
    const releaseName = `me.rainbow@${VersionNumber.appVersion}+${dist}`;
    sentryOptions.release = releaseName;
    // and we also need to manually set the dist to the versionCode value
    sentryOptions.dist = dist.toString();
  }
  Sentry.init(sentryOptions);
}

enableScreens();

class App extends Component {
  static propTypes = {
    requestsForTopic: PropTypes.func,
  };

  state = { appState: AppState.currentState, initialRoute: null };

  async componentDidMount() {
    if (__DEV__) {
      const RNAsyncStorageFlipper = require('rn-async-storage-flipper').default;
      const AsyncStorage = require('@react-native-community/async-storage')
        .default;
      RNAsyncStorageFlipper(AsyncStorage);
    }

    if (!__DEV__ && NativeModules.RNTestFlight) {
      const { isTestFlight } = NativeModules.RNTestFlight.getConstants();
      Logger.sentry(`Test flight usage - ${isTestFlight}`);
    }

    this.identifyFlow();
    AppState.addEventListener('change', this.handleAppStateChange);
    saveFCMToken();
    this.onTokenRefreshListener = registerTokenRefreshListener();

    this.foregroundNotificationListener = messaging().onMessage(
      this.onRemoteNotification
    );

    this.backgroundNotificationListener = messaging().setBackgroundMessageHandler(
      this.onRemoteNotification
    );

    this.backgroundNotificationHandler = messaging().setBackgroundMessageHandler(
      async remoteMessage => {
        console.log('Message handled in the background!', remoteMessage);
      }
    );

    // Walletconnect uses direct deeplinks
    if (android) {
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
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.walletReady && this.props.walletReady) {
      // Everything we need to do after the wallet is ready goes here
      Logger.sentry('✅ Wallet ready!');
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
    this.backgroundNotificationHandler?.();
  }

  identifyFlow = async () => {
    const address = await loadAddress();
    if (address) {
      this.setState({ initialRoute: Routes.SWIPE_LAYOUT });
    } else {
      this.setState({ initialRoute: Routes.WELCOME_SCREEN });
    }
  };

  onRemoteNotification = notification => {
    const topic = get(notification, 'data.topic');
    setTimeout(() => {
      this.onPushNotificationOpened(topic);
    }, WALLETCONNECT_SYNC_DELAY);
  };

  onPushNotificationOpened = topic => {
    const { requestsForTopic } = this.props;
    const requests = requestsForTopic(topic);
    if (requests) {
      // WC requests will open automatically
      return false;
    }
    // In the future, here  is where we should
    // handle all other kinds of push notifications
    // For ex. incoming txs, etc.
  };

  handleAppStateChange = async nextAppState => {
    // Restore WC connectors when going from BG => FG
    if (this.state.appState === 'background' && nextAppState === 'active') {
      store.dispatch(walletConnectLoadState());
    }

    this.setState({ appState: nextAppState });

    Logger.sentry(`App state change to ${nextAppState}`);
  };

  handleNavigatorRef = navigatorRef =>
    Navigation.setTopLevelNavigator(navigatorRef);

  render = () => (
    <MainThemeProvider>
      <RainbowContextWrapper>
        <Portal>
          <SafeAreaProvider>
            <PinnedHiddenItemOptionProvider>
              <ApolloProvider client={apolloClient}>
                <Provider store={store}>
                  <FlexItem>
                    <CheckSystemReqs>
                      {this.state.initialRoute && (
                        <InitialRouteContext.Provider
                          value={this.state.initialRoute}
                        >
                          <RoutesComponent ref={this.handleNavigatorRef} />
                          <PortalConsumer />
                        </InitialRouteContext.Provider>
                      )}
                    </CheckSystemReqs>
                    <OfflineToast />
                  </FlexItem>
                </Provider>
              </ApolloProvider>
            </PinnedHiddenItemOptionProvider>
          </SafeAreaProvider>
        </Portal>
      </RainbowContextWrapper>
    </MainThemeProvider>
  );
}

const CheckSystemReqs = ({ children }) => {
  const hideSplashScreen = useHideSplashScreen();
  const appVersion = VersionNumber.appVersion;
  const [ready, setReady] = useState(false);
  const [minimumVersion, setMinimumVersion] = useState(null);
  const [maintenanceStatus, setMaintenanceStatus] = useState(null);
  const hasMaintenanceStatus = Boolean(maintenanceStatus);
  const hasMinimumVersion = Boolean(minimumVersion);
  async function getReqs() {
    const [maintenanceStatusResponse, minVersionResponse] = await Promise.all([
      getMaintenanceStatus(),
      getMinimumVersion(),
    ]);

    setMaintenanceStatus(maintenanceStatusResponse);
    setMinimumVersion(minVersionResponse.minVersion);
  }

  useEffect(() => {
    getReqs();
  }, []);

  useEffect(() => {
    if (hasMaintenanceStatus && hasMinimumVersion) {
      setReady(true);
    }
  }, [hasMaintenanceStatus, hasMinimumVersion, hideSplashScreen]);

  if (ready) {
    if (maintenanceStatus.maintenanceActive) {
      return <MaintenanceMode message={maintenanceStatus.maintenanceMessage} />;
    }

    const forceUpdate = Boolean(
      parseInt(compareVersions(minimumVersion, appVersion)) > 0
    );

    if (forceUpdate) {
      return <MinimumVersion />;
    }
  }

  hideSplashScreen();

  return children;
};

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
