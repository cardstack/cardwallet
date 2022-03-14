import { Platform } from 'react-native';
import { screenHeight, screenWidth } from './dimension-utils';

const isIOS = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';

const Device = {
  isAndroid,
  isIOS,
  screenHeight,
  screenWidth,
  cloudPlatform: isIOS ? 'iCloud' : 'Google Drive',
  keyboardBehavior: isIOS ? ('padding' as const) : undefined,
  supportsFiatOnRamp: isIOS,
  supportsNativeWyreIntegration: isIOS,
  supportsHapticFeedback: isIOS,
  scrollSheetOffset: isIOS ? -(screenHeight * 0.2) : 1,
  tabBarHeightSize: screenHeight * 0.1,
};

export { Device };
