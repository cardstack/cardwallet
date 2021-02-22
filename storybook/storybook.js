import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';
import {
  addDecorator,
  addParameters,
  configure,
  getStorybookUI,
} from '@storybook/react-native';
import React from 'react';
import { AppRegistry } from 'react-native';

import { name as appName } from '../app.json';
import { CenteredContainer } from '../src2/components/Container';
import { loadStories } from './storyLoader';

// addons!
import './rn-addons';

// adding a centered-view layout!
const CenterView = ({ children }) => (
  <CenteredContainer
    flex={1}
    width={'100%'}
  >
    {children}
  </CenteredContainer>
);

// global decorators!
addDecorator(getStory => <CenterView>{getStory()}</CenterView>);
addDecorator(withBackgrounds);
addParameters({
  backgrounds: [
    { name: 'light', value: '#fff', default: true },
    { name: 'gray', value: '#808080' },
    { name: 'dark', value: '#000' },
  ],
});

// stories!
configure(() => {
  loadStories();
}, module);

// Refer to https://github.com/storybookjs/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({});

AppRegistry.registerComponent(appName, () => StorybookUIRoot);

export default StorybookUIRoot;
