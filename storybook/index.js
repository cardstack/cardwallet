// index.js
import {
    addDecorator,
    addParameters,
    configure,
    getStorybookUI,
  } from '@storybook/react-native';
import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';
import React from 'react';
import { name as appName } from '../app.json';
import { AppRegistry } from 'react-native';
import {loadStories} from './storyLoader';
import {useHideSplashScreen} from '@rainbow-me/hooks';
import {useEffect} from 'react';
import {ThemeProvider} from '@shopify/restyle';
import { CenteredContainer } from '../src2/components/Container';

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
    )
}

export default StorybookUIRoot;