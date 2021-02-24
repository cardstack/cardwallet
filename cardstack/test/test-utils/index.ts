import {
  render,
  RenderOptions,
  RenderResult,
} from '@testing-library/react-native';
import React from 'react';

const customerRender = (
  component: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>
): RenderResult => render(component, options);

export * from '@testing-library/react-native';

export { customerRender as render };
