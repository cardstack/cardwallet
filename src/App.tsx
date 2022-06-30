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
import { name as appName } from '../app.json';
import { OfflineToast } from './components/toasts';
import {
  reactNativeDisableYellowBox,
  showNetworkRequests,
  showNetworkResponses,
} from './config/debug';
import { MainThemeProvider } from './context/ThemeContext';
import monitorNetwork from './debugging/network';
import { PinnedHiddenItemOptionProvider } from './hooks';

import store, { persistor } from './redux/store';
import MaintenanceMode from './screens/MaintenanceMode';
import { useAppInit } from './useAppInit';
import ErrorBoundary from '@cardstack/components/ErrorBoundary/ErrorBoundary';
import { MinimumVersion } from '@cardstack/components/MinimumVersion';
import { apolloClient } from '@cardstack/graphql/apollo-client';
import { AppContainer } from '@cardstack/navigation';
import theme from '@cardstack/theme';
import { Device } from '@cardstack/utils';
import PortalConsumer from '@rainbow-me/components/PortalConsumer';
import { Portal } from 'react-native-cool-modals/Portal';

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

AppRegistry.registerComponent(appName, () => withIAPContext(AppWithStore));
