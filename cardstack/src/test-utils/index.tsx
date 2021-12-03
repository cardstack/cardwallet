import React from 'react';
import { ThemeProvider } from '@shopify/restyle';
import {
  render as rntlRender,
  RenderOptions,
  RenderAPI,
} from '@testing-library/react-native';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import theme from '../theme';
import reducers from '@rainbow-me/redux/reducers';
import { safesApi } from '@cardstack/services/safes-api';

console.log({ 'reducers.charts': reducers.charts });

const render = (
  component: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>
): RenderAPI => {
  const store = configureStore({
    reducer: {
      ...reducers,
      [safesApi.reducerPath]: safesApi.reducer,
    },
  });

  return rntlRender(
    <Provider store={store}>
      <ThemeProvider theme={theme}>{component}</ThemeProvider>
    </Provider>,
    options
  );
};

export * from '@testing-library/react-native';
export { render };
