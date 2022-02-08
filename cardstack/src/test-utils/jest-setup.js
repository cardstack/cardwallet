/* global jest */
/* eslint no-undef: "error" */
import React from 'react';
import { View as RNView } from 'react-native';
import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

// GLOBAL LIBS MOCKS

jest.mock('react-native-flipper');

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

jest.mock('@react-navigation/material-top-tabs', () => ({
  createMaterialTopTabNavigator: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

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

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

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

jest.mock('react-native-version-number', () => ({
  VersionNumber: jest.fn(),
}));

jest.mock('@reduxjs/toolkit/query/react', () => ({
  ...jest.requireActual('@reduxjs/toolkit/query/react'),
  fetchBaseQuery: jest.fn(),
}));

// RAINBOW MOCKS

jest.mock('@rainbow-me/references', () => ({
  shitcoins: 'JSON-MOCK-RETURN',
}));

jest.mock('@rainbow-me/navigation/', () => ({
  ExchangeModalNavigator: jest.fn(),
}));

jest.mock('@rainbow-me/react-native-payments', () => ({
  PaymentRequest: jest.fn(),
}));

jest.mock('@rainbow-me/parsers/gas', () => ({
  default: jest.fn(),
}));

jest.mock('@rainbow-me/references', () => ({
  shitcoins: 'JSON-MOCK-RETURN',
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

jest.mock('@rainbow-me/utils', () => ({
  magicMemo: jest.fn(),
  neverRerender: jest.fn(),
}));

jest.mock('@rainbow-me/utils/safeAreaInsetValues', () => ({
  default: jest.fn(),
}));

jest.mock('@rainbow-me/hooks/charts/useChartThrottledPoints', () => ({
  default: jest.fn(),
}));

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

jest.mock('@rainbow-me/hooks', () => ({
  useInitializeWallet: jest.fn(),
}));

jest.mock('@rainbow-me/redux/hooks', () => ({
  useRainbowSelector: jest.fn(),
}));

jest.mock('@rainbow-me/utils/measureText', () => ({
  default: jest.fn(),
}));

jest.mock('@rainbow-me/react-native-animated-number', () => ({
  AnimatedNumber: jest.fn(),
}));

jest.mock('@rainbow-me/components/text', () => ({
  default: jest.fn(),
}));

const mockIcon = props => <RNView testID={'icon-' + props.name} />;
jest.mock('@rainbow-me/components/icons', () => ({
  Icon: jest.fn(mockIcon),
}));

// CARDSTACK MOCKS

jest.mock('@cardstack/components/Icon', () => ({
  Icon: jest.fn(mockIcon),
}));

jest.mock('@cardstack/components/Text/EmojiText', () => ({
  default: jest.fn(),
}));

jest.mock('@cardstack/navigation', () => ({
  useLoadingOverlay: () => ({
    showLoadingOverlay: jest.fn(),
    dismissLoadingOverlay: jest.fn(),
  }),
}));

jest.mock('@cardstack/navigation/screens', () => ({
  default: jest.fn(),
}));

// Mock to avoid not checksum address console.warn
jest.mock('@uniswap/sdk', () => ({
  ...jest.requireActual('@uniswap/sdk'),
  Token: jest.fn(),
}));

jest.mock('easyqrcode-react-native', () => ({
  QRCode: jest.fn(),
  Canvas: jest.fn(),
}));

jest.mock('react-native-localize', () => ({
  getLocales: () => [
    {
      countryCode: 'GB',
      languageTag: 'en-GB',
      languageCode: 'en',
      isRTL: false,
    },
    {
      countryCode: 'US',
      languageTag: 'en-US',
      languageCode: 'en',
      isRTL: false,
    },
    {
      countryCode: 'FR',
      languageTag: 'fr-FR',
      languageCode: 'fr',
      isRTL: false,
    },
  ],

  getNumberFormatSettings: () => ({
    decimalSeparator: '.',
    groupingSeparator: ',',
  }),

  getCalendar: () => 'gregorian', // or "japanese", "buddhist"
  getCountry: () => 'US', // the country code you want
  getCurrencies: () => ['USD', 'EUR'], // can be empty array
  getTemperatureUnit: () => 'celsius', // or "fahrenheit"
  getTimeZone: () => 'Europe/Paris', // the timezone you want
  uses24HourClock: () => true,
  usesMetricSystem: () => true,

  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

global.ios = true;
global.android = false;
