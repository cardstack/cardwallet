import { Platform } from 'react-native';

// Note: Prefer to use textVariants instead.
export const fontWeights = Platform.select({
  ios: {
    regular: '400',
    semibold: '500',
    bold: '600',
    extraBold: '700',
  },
  default: {
    regular: 'normal',
    semibold: 'normal',
    bold: 'bold',
    extraBold: 'bold',
  },
});
