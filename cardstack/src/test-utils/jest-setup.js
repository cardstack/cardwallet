/* eslint-disable import/order */
/* global jest */
/* eslint no-undef: "error" */
import React from 'react';
import { View as RNView } from 'react-native';
import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import { Device } from '@cardstack/utils/device';

// GLOBAL LIBS MOCKS
global.__reanimatedWorkletInit = jest.fn();

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

jest.mock('redux-persist', () => {
  const real = jest.requireActual('redux-persist');
  return {
    ...real,
    persistReducer: jest
      .fn()
      .mockImplementation((config, reducers) => reducers),
  };
});

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.mock('react-native-flipper');

jest.mock('react-native-keychain', () => ({
  getSupportedBiometryType: jest.fn(),
  ACCESSIBLE: 'AccessibleAlways',
}));

jest.mock('react-native-device-info', () => ({
  isEmulator: () => false,
  useisEmulator: () => false,
  getVersion: () => '1.0.0',
  getBuildNumber: () => '1',
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

jest.mock('@react-navigation/bottom-tabs', () => ({
  useBottomTabBarHeight: jest.fn(),
}));

export const mockUseNavigation = {
  navigate: jest.fn(),
  replace: jest.fn(),
  reset: jest.fn(),
  goBack: jest.fn(),
};

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: mockUseNavigation,
  useRoute: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
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

jest.mock('@walletconnect/core', () => ({
  Core: jest.fn(),
}));

jest.mock('@walletconnect/sign-client', () => ({
  default: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('@apollo/client', () => ({
  ApolloClient: jest.fn(),
  HttpLink: jest.fn(),
  InMemoryCache: jest.fn(),
}));

jest.mock('@react-native-firebase/messaging', () => ({
  messaging: jest.fn(),
}));

jest.mock('react-native-cloud-fs', () => ({
  RNCloudFs: jest.fn(),
}));

jest.mock('react-native-fs', () => ({
  RNFS: jest.fn(),
}));

jest.mock('react-native-haptic-feedback', () => ({
  ReactNativeHapticFeedback: jest.fn(),
}));

jest.mock('react-native-action-sheet', () => ({
  ActionSheet: jest.fn(),
}));

jest.mock('react-native-permissions', () => ({
  requestNotifications: jest.fn(),
}));

jest.mock('react-native-bootsplash', () => ({
  hide: jest.fn().mockResolvedValueOnce(),
  show: jest.fn().mockResolvedValueOnce(),
  getVisibilityStatus: jest.fn().mockResolvedValue('hidden'),
}));

jest.mock('@reduxjs/toolkit/query/react', () => ({
  ...jest.requireActual('@reduxjs/toolkit/query/react'),
  fetchBaseQuery: jest.fn(),
}));

// RAINBOW MOCKS

jest.mock('@rainbow-me/redux/store', () => ({
  default: jest.fn().mockImplementation(() => ({
    dispatch: jest.fn(),
    getState: jest.fn(),
  })),
}));

jest.mock('@rainbow-me/references', () => ({
  spammyTokens: 'JSON-MOCK-RETURN',
}));

jest.mock('@rainbow-me/react-native-payments', () => ({
  PaymentRequest: jest.fn(),
}));

jest.mock('@rainbow-me/references/migratedTokens.json', () => ({}));

jest.mock('@rainbow-me/utils', () => ({
  neverRerender: jest.fn(),
}));

jest.mock('@rainbow-me/components/animations/procs', () => ({
  default: jest.fn(),
}));

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
  useWalletManager: jest.fn(),
}));

jest.mock('@rainbow-me/redux/hooks', () => ({
  useRainbowSelector: jest.fn(),
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

Device.isIOS = true;
Device.isAndroid = false;
