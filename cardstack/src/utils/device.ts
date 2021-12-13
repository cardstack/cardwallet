import { Platform } from 'react-native';

const isIOS = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';

const Device = {
  cloudPlatform: isIOS ? 'iCloud' : 'Google Drive',
  keyboardBehavior: isIOS ? ('padding' as const) : undefined,
  isAndroid,
  isIOS,
  supportsFiatOnRamp: isIOS,
  supportsPrefilledAmount: isIOS,
};

export { Device };
