import { Platform } from 'react-native';

const Device = {
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
};

export { Device };
