import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';

/* eslint-disable no-undef */
jest.mock('react-native-background-timer', () => ({
  identify: () => null,
  reset: () => null,
  setup: () => null,
}));

jest.mock('react-native-device-info', () => ({
  identify: () => null,
  reset: () => null,
  setup: () => null,
}));

jest.mock('@segment/analytics-react-native', () => ({
  identify: () => null,
  reset: () => null,
  setup: () => null,
}));

jest.mock('@sentry/react-native', () => ({
  captureException: () => null,
}));

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);

jest.autoMockOff();
jest.mock('react-native-keychain', () => ({
  ACCESSIBLE: {
    ALWAYS_THIS_DEVICE_ONLY: 'kSecAttrAccessibleAlwaysThisDeviceOnly',
  },
  getGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
  setGenericPassword: jest.fn(),
}));
jest.mock('@uniswap/sdk', () => ({
  ChainId: jest.requireActual('@uniswap/sdk').ChainId,
  Token: jest.fn(),
  WETH: jest.requireActual('@uniswap/sdk').WETH,
}));
