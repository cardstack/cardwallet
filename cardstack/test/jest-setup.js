import '@testing-library/jest-native/extend-expect';

jest.mock('react-native-background-timer', () => ({
  start: jest.fn(),
  stop: jest.fn(),
  setTimeout: jest.fn(),
  clearTimeout: jest.fn(),
}));

global.ios = true;
global.android = false;
