import { createTheme } from '@shopify/restyle';
import { fontSizes } from './fontSizes';
import { fontWeights } from './fontWeights';
import { buttonVariants } from './buttonVariants';
import { colors } from './colors';
import { textVariants } from './textVariants';
import { spacing } from './spacing';
import { breakpoints } from './breakpoints';

const theme = createTheme({
  breakpoints,
  buttonVariants,
  colors,
  spacing,
  textVariants,
  fontWeights,
  fontSizes,
});

export * from './buttonVariants';
export * from './colors';
export * from './textVariants';
export * from './spacing';
export * from './breakpoints';
export * from './fontSizes';
export * from './fontWeights';
export * from './customFunctions';

export type Theme = typeof theme;
export default theme;
