import { Platform } from 'react-native';

export const fontWeights = Platform.select({
  ios: {
    regular: '400',
    bold: '600',
    extraBold: '700',
  },
  default: {
    regular: 'normal',
    bold: 'bold',
    extraBold: 'bold',
  },
});
