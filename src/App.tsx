import { ApolloProvider } from '@apollo/client';
import * as Sentry from '@sentry/react-native';
import { ThemeProvider } from '@shopify/restyle';
import React from 'react';
import { AppRegistry, LogBox, StatusBar, UIManager } from 'react-native';
import { SENTRY_ENDPOINT } from 'react-native-dotenv';
import { withIAPContext } from 'react-native-iap';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { NetworkToast } from '@cardstack/components';
import ErrorBoundary from '@cardstack/components/ErrorBoundary/ErrorBoundary';
import { MinimumVersion } from '@cardstack/components/MinimumVersion';
import { apolloClient } from '@cardstack/graphql/apollo-client';
import { AppContainer } from '@cardstack/navigation';
import { useAuthSelectorAndActions } from '@cardstack/redux/authSlice';
import theme from '@cardstack/theme';
import { Device } from '@cardstack/utils';

import { name as appName } from '../app.json';

import {
  reactNativeDisableYellowBox,
  showNetworkRequests,
  showNetworkResponses,
} from './config/debug';
import monitorNetwork from './debugging/network';
import { PinnedHiddenItemOptionProvider } from './hooks';
import store, { persistor } from './redux/store';
import MaintenanceMode from './screens/MaintenanceMode';
import { useAppInit } from './useAppInit';

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

const App = () => {
  const { forceUpdate, maintenance } = useAppInit();
  const { hasWallet } = useAuthSelectorAndActions();

  if (maintenance.active) {
    return <MaintenanceMode message={maintenance.message} />;
  }

  if (forceUpdate) {
    return <MinimumVersion />;
  }

  return (
    <SafeAreaProvider>
      <PinnedHiddenItemOptionProvider>
        <AppContainer />
        {hasWallet && <NetworkToast />}
      </PinnedHiddenItemOptionProvider>
    </SafeAreaProvider>
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

AppRegistry.registerComponent(appName, () => withIAPContext(AppWithStore));
