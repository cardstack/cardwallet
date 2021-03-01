import { ThemeProvider } from '@shopify/restyle';
import {
  render,
  RenderOptions,
  RenderResult,
} from '@testing-library/react-native';
import React from 'react';

import theme from '../../src/theme';

const customerRender = (
  component: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>
): RenderResult =>
  render(<ThemeProvider theme={theme}>{component}</ThemeProvider>, options);

export * from '@testing-library/react-native';

export { customerRender as render };
