import { Platform } from 'react-native';

const isIOS = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';

const Device = {
  isIOS,
  isAndroid,
  supportsFiatOnRamp: isIOS,
};

export { Device };
