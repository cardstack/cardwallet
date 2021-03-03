import { ThemeProvider } from '@shopify/restyle';
import {
  render,
  RenderOptions,
  RenderAPI,
} from '@testing-library/react-native';
import React from 'react';

import theme from '../../src/theme';

const customerRender = (
  component: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>
): RenderAPI =>
  render(<ThemeProvider theme={theme}>{component}</ThemeProvider>, options);

export * from '@testing-library/react-native';

export { customerRender as render };
