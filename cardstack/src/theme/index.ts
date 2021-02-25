import { createTheme } from '@shopify/restyle';
import { buttonVariants } from './buttonVariants';
import { colors } from './colors';
import { textVariants } from './textVariants';
import { spacing } from './spacing';

const theme = createTheme({
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
  buttonVariants,
  colors,
  spacing,
  textVariants,
});

export * from './buttonVariants';
export * from './colors';
export * from './textVariants';
export * from './spacing';

export type Theme = typeof theme;
export default theme;
