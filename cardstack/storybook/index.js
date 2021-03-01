// addons!
import './rn-addons';

// index.js
import { ThemeProvider } from '@shopify/restyle';
import {
  addDecorator,
  addParameters,
  configure,
  getStorybookUI,
} from '@storybook/react-native';
import React, { useEffect } from 'react';
import { AppRegistry } from 'react-native';

import theme from '@cardstack/theme';
import { name as appName } from '../../app.json';
import { CenteredContainer } from '../src/components/Container';
import { loadStories } from './storyLoader';
import { useHideSplashScreen } from '@rainbow-me/hooks';
import { withKnobs } from '@storybook/addon-knobs';

// adding a centered-view layout!
const CenterView = ({ children }) => (
  <CenteredContainer flex={1} width="100%" padding={4} backgroundColor="backgroundBlue">
    {children}
  </CenteredContainer>
);

// global decorators!
addDecorator(getStory => <CenterView>{getStory()}</CenterView>);
addDecorator(withKnobs);

configure(() => {
  loadStories();
}, module);

const StorybookUIRoot = getStorybookUI({});

const Storybook = () => {
  const hideSplashScreen = useHideSplashScreen();

  useEffect(() => {
    hideSplashScreen();
  });

  return (
    <ThemeProvider theme={theme}>
      <StorybookUIRoot />
    </ThemeProvider>
  );
};

AppRegistry.registerComponent(appName, () => Storybook);
