/* eslint-disable no-undef */
import '@testing-library/jest-native/extend-expect';

// GLOBAL LIBS MOCKS

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
  const View = require('react-native/Libraries/Components/View/View');
  return {
    Value: jest.fn(),
    event: jest.fn(),
    add: jest.fn(),
    eq: jest.fn(),
    set: jest.fn(),
    cond: jest.fn(),
    interpolate: jest.fn(),
    View,
    Extrapolate: { CLAMP: jest.fn() },
    Clock: jest.fn(),
    greaterThan: jest.fn(),
    lessThan: jest.fn(),
    startClock: jest.fn(),
    stopClock: jest.fn(),
    clockRunning: jest.fn(),
    not: jest.fn(),
    or: jest.fn(),
    and: jest.fn(),
    spring: jest.fn(),
    decay: jest.fn(),
    defined: jest.fn(),
    call: jest.fn(),
    Code: View,
    block: jest.fn(),
    abs: jest.fn(),
    greaterOrEq: jest.fn(),
    lessOrEq: jest.fn(),
    debug: jest.fn(),
    Easing: {
      in: jest.fn(),
      out: jest.fn(),
    },
    Transition: {
      Out: 'Out',
    },
  };
});

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

jest.mock('styled-components', () => ({
  styled: jest.fn(),
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

jest.mock('@rainbow-me/utils/safeAreaInsetValues', () => ({
  default: jest.fn(),
}));

jest.mock('@rainbow-me/hooks/charts/useChartThrottledPoints', () => ({
  default: jest.fn(),
}));

jest.mock('@rainbow-me/components/animations/procs', () => ({
  default: jest.fn(),
}));

jest.mock('@rainbow-me/components/animations/ButtonPressAnimation', () => ({
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
  useInitializeWallet: jest.fn(),
}));

jest.mock('@rainbow-me/redux/hooks', () => ({
  useRainbowSelector: jest.fn(),
}));

jest.mock('@rainbow-me/styles', () => ({
  buildTextStyles: jest.fn(),
  calcDirectionToDegrees: jest.fn(),
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

jest.mock('@rainbow-me/components/icons', () => ({
  default: jest.fn(),
}));

// CARDSTACK MOCKS

jest.mock('@cardstack/components', () => ({
  default: jest.fn(),
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

global.ios = true;
global.android = false;
