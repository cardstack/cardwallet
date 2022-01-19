import React, { memo } from 'react';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import { linking } from './screens';
import { TabBarFeatureProvider } from './tabBarNavigator';
import { onNavigationStateChange } from '@rainbow-me/navigation/onNavigationStateChange';
// @ts-expect-error ts doesn't know about Platform-specific extensions
import PlatformNavigator from '@rainbow-me/navigation/Routes';

const AppContainer = React.forwardRef<
  React.PropsWithChildren<NavigationContainerRef>,
  NavigationContainerRef
>((_, ref) => (
  <NavigationContainer
    linking={linking}
    onStateChange={onNavigationStateChange}
    ref={ref}
  >
    <TabBarFeatureProvider>
      <PlatformNavigator />
    </TabBarFeatureProvider>
  </NavigationContainer>
));

AppContainer.displayName = 'AppContainer';

export default memo(AppContainer);
