/* eslint-disable no-undef */
import React from 'react';
import 'react-native-gesture-handler/jestSetup';
import { View as RNView } from 'react-native';
import '@testing-library/jest-native/extend-expect';
import * as ReactNative from 'react-native';
import * as RainbowHooks from '@rainbow-me/hooks';

// GLOBAL LIBS MOCKS

jest.mock('react-native-flipper');

export const alert = jest.fn();
export const Alert = { alert };

export const dimensionWidth = 480;
export const Dimensions = {
  get: jest.fn().mockReturnValue({ width: dimensionWidth, height: 960 }),
};

export const Image = 'Image';

export const keyboardDismiss = jest.fn();
export const Keyboard = {
  dismiss: keyboardDismiss,
};

export const Platform = {
  ...ReactNative.Platform,
  OS: 'ios',
  Version: 16,
  isTesting: true,
  select: objs => objs.ios,
};

export const StyleSheet = {
  create: jest.fn(),
};

export default Object.setPrototypeOf(
  {
    Alert,
    Dimensions,
    Image,
    Keyboard,
    NativeModules: {
      RNSentry: {},
      NetInfo: {},
      RNGetRandomValues: {
        getRandomBase64: jest.fn(),
      },
    },
    Platform,
    StyleSheet,
  },
  ReactNative
);

jest.doMock('react-native', () => {
  // Extend ReactNative
  return Object.setPrototypeOf(
    {
      useWindowDimensions: jest.fn().mockReturnValue({
        width: dimensionWidth,
        height: 960,
        scale: 1,
        fontScale: 1,
      }),
    },
    ReactNative
  );
});

jest.mock('@sentry/react-native', () => ({
  addBreadcrumb: jest.fn(),
  captureException: jest.fn(),
}));

jest.mock('react-native-get-random-values/getRandomBase64', () => () => {
  // nada
});

jest.mock('react-native-background-timer', () => ({
  start: jest.fn(),
  stop: jest.fn(),
  setTimeout: jest.fn(),
  clearTimeout: jest.fn(),
}));

jest.mock('react-native-keychain', () => ({
  getSupportedBiometryType: jest.fn(),
  ACCESSIBLE: 'AccessibleAlways',
}));

jest.mock('react-native-device-info', () => ({
  DeviceInfo: {
    isEmulator: () => false,
  },
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {
    /* noop */
  };

  return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('@react-navigation/material-top-tabs', () => ({
  createMaterialTopTabNavigator: jest.fn(),
}));

// jest.mock('react-redux', () => ({
//   useSelector: jest.fn(),
// }));

jest.mock('react-native-iphone-x-helper', () => ({
  isIphoneX: jest.fn(),
  getStatusBarHeight: jest.fn(),
  getBottomSpace: jest.fn(),
}));

jest.mock('react-native-redash', () => ({
  useValue: jest.fn(),
}));

jest.mock('react-native-mail', () => ({
  Mailer: jest.fn(),
}));

jest.mock('react-native-public-ip', () => ({
  publicIP: jest.fn(),
}));

jest.mock('@react-native-community/async-storage', () => ({
  AsyncStorage: jest.fn(),
}));

jest.mock('@apollo/client', () => ({
  ApolloClient: jest.fn(),
  HttpLink: jest.fn(),
  InMemoryCache: jest.fn(),
}));

jest.mock('react-native-android-keyboard-adjust', () => ({
  AndroidKeyboardAdjust: jest.fn(),
}));

jest.mock('@react-native-firebase/messaging', () => ({
  messaging: jest.fn(),
}));

jest.mock('react-native-cloud-fs', () => ({
  RNCloudFs: jest.fn(),
  RNFS: jest.fn(),
}));

jest.mock('react-native-fs', () => ({
  RNFS: jest.fn(),
}));

jest.mock('rn-dominant-color', () => ({
  getColorFromURL: jest.fn(),
}));

jest.mock('react-native-haptic-feedback', () => ({
  ReactNativeHapticFeedback: jest.fn(),
}));

jest.mock('react-native-text-size', () => ({
  TextSize: jest.fn(),
}));

jest.mock('react-native-safe-area-view', () => ({
  SafeAreaView: jest.fn(),
}));

jest.mock('react-native-action-sheet', () => ({
  ActionSheet: jest.fn(),
}));

jest.mock('react-native-permissions', () => ({
  requestNotifications: jest.fn(),
}));

jest.mock('react-native-splash-screen', () => ({
  SplashScreen: jest.fn(),
}));

// jest.mock('styled-components', () => ({
//   styled: jest.fn(),
// }));

// jest.mock('@shopify/restyle', () => {
//   const RealModule = jest.requireActual('@shopify/restyle');
//   const RN = jest.requireActual('react-native');
//   RealModule.createText = () => RN.Text;
//   RealModule.createBox = () => RN.View;
//   RealModule.createRestyleComponent = (_f, c) => c || RN.View;

//   return RealModule;
// });

jest.mock('@react-native-community/netinfo', () => ({
  default: {
    getCurrentConnectivity: jest.fn(),
    isConnectionMetered: jest.fn(),
    addListener: jest.fn(),
    removeListeners: jest.fn(),
    isConnected: {
      fetch: () => {
        return Promise.resolve(true);
      },
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
  },
}));

jest.mock('@rainbow-me/components/text', () => ({
  default: jest.fn(),
}));

jest.mock('@reduxjs/toolkit/query/react', () => ({
  ...jest.requireActual('@reduxjs/toolkit/query/react'),
  fetchBaseQuery: jest.fn(),
}));

// RAINBOW MOCKS

// jest.mock('@rainbow-me/references', () => ({
//   shitcoins: 'JSON-MOCK-RETURN',
// }));

jest.mock('@rainbow-me/navigation/', () => ({
  ExchangeModalNavigator: jest.fn(),
  useNavigation: jest.fn(() => ({ navigate: jest.fn() })),
}));

jest.mock('@rainbow-me/react-native-payments', () => ({
  PaymentRequest: jest.fn(),
}));

jest.mock('@rainbow-me/parsers/gas', () => ({
  default: jest.fn(),
}));

jest.mock('@rainbow-me/references/migratedTokens.json', () => ({}));

jest.mock('@rainbow-me/redux/gas', () => ({
  default: jest.fn(),
}));

jest.mock('@rainbow-me/redux/keyboardHeight', () => ({
  default: jest.fn(),
}));

jest.mock('@rainbow-me/redux/uniswap', () => ({
  default: jest.fn(),
}));

jest.mock('@rainbow-me/utils/safeAreaInsetValues', () => ({
  default: jest.fn(),
}));

// jest.mock('@rainbow-me/hooks/charts/useChartThrottledPoints', () => ({
//   default: jest.fn(),
// }));

jest.mock('@rainbow-me/components/animations/procs', () => ({
  default: jest.fn(),
}));

const mockButtonPressAnimation = ({ children }) => <RNView>{children}</RNView>;
jest.mock('@rainbow-me/components/animations/ButtonPressAnimation', () =>
  jest.fn(mockButtonPressAnimation)
);

jest.mock('@rainbow-me/components/animations', () => ({
  default: jest.fn(),
}));

jest.mock('@rainbow-me/components/layout', () => ({
  default: jest.fn(),
}));

jest.mock('@rainbow-me/components/coin-row', () => ({
  default: jest.fn(),
}));

jest.doMock('@rainbow-me/hooks', () => {
  return {
    ...RainbowHooks,
    useAccountProfile: jest.fn(),
    useInitializeWallet: jest.fn(),
    useInternetStatus: jest.fn(() => true),
  };
});

jest.mock('@rainbow-me/utils/measureText', () => ({
  default: jest.fn(),
}));

jest.mock('@rainbow-me/react-native-animated-number', () => ({
  AnimatedNumber: jest.fn(),
}));

jest.mock('@rainbow-me/animated-charts', () => ({
  default: jest.fn(),
}));

jest.mock('@rainbow-me/components/text', () => ({
  default: jest.fn(),
}));

jest.mock('@rainbow-me/components/icons', () => ({
  default: jest.fn(),
}));

// CARDSTACK MOCKS

const mockIcon = props => <RNView testID={'icon-' + props.name} />;
jest.mock('@cardstack/components/Icon', () => ({
  Icon: jest.fn(mockIcon),
}));

jest.mock('@cardstack/components/Text/EmojiText', () => ({
  default: jest.fn(),
}));

jest.mock('@cardstack/navigation/screens', () => ({
  default: jest.fn(),
}));

// Mock to avoid not checksum address console.warn
jest.mock('@uniswap/sdk', () => ({
  ...jest.requireActual('@uniswap/sdk'),
  Token: jest.fn(),
}));

jest.mock('@cardstack/navigation', () => ({
  useLoadingOverlay: () => ({
    showLoadingOverlay: jest.fn(),
    dismissLoadingOverlay: jest.fn(),
  }),
}));

jest.mock('easyqrcode-react-native', () => ({
  QRCode: jest.fn(),
  Canvas: jest.fn(),
}));

global.ios = true;
global.android = false;
