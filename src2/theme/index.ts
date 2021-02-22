import { createTheme } from '@shopify/restyle';
import { buttonVariants } from '../components/Button/buttonVariants';
import { textVariants } from './../components/Text/textVariants';
import { colors } from './colors';

const theme = createTheme({
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
  buttonVariants,
  colors,
  spacing: {
    '1': 4,
    '2': 8,
    '3': 12,
    '4': 16,
    '5': 20,
    '6': 24,
  },
  textVariants,
});

export type Theme = typeof theme;
export default theme;
