/* eslint-disable no-undef, @typescript-eslint/no-var-requires, @typescript-eslint/no-empty-function */
import '@testing-library/jest-native/extend-expect';
import 'jest-styled-components/native';

require('jest-fetch-mock').enableMocks();
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    /* Buttons */
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    /* Other */
    FlatList: View,
    gestureHandlerRootHOC: jest.fn(),
    Directions: {},
  };
});

jest.mock('react-native-reanimated', () => ({
  call: jest.fn(),
  cond: jest.fn(),
  event: jest.fn(),
  eq: jest.fn(),
  proc: jest.fn(),
  View: jest.fn(() => null),
}));

jest.mock('react-native-tab-view', () => {});
jest.mock('@segment/analytics-react-native', () => {});
jest.mock('uniswap-xdai-sdk', () => ({
  ...jest.requireActual('uniswap-xdai-sdk'),
  Token: jest.fn(),
}));

jest.mock('react-native-background-timer', () => {});
jest.mock('react-native-keychain', () => ({
  ACCESSIBLE: 'accessible',
  getSupportedBiometryType: jest.fn(),
}));

jest.mock('react-native-device-info', () => {});
jest.mock('react-native-redash', () => {});

jest.mock('@react-native-community/async-storage', () => {});
