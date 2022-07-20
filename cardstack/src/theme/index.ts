import { createTheme } from '@shopify/restyle';

import { breakpoints } from './breakpoints';
import { buttonVariants } from './buttonVariants';
import { colors } from './colors';
import { fontSizes } from './fontSizes';
import { fontWeights } from './fontWeights';
import { spacing } from './spacing';
import { textVariants } from './textVariants';

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
export * from './fontFamilyVariants';

export type Theme = typeof theme;
export default theme;
