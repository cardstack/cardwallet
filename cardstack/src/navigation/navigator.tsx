import { NavigationContainer } from '@react-navigation/native';
import React, { memo } from 'react';

import { navigationRef } from './Navigation';
import { onNavigationStateChange } from './onNavigationStateChange';
import { linking } from './screens';
import { StackNavigator } from './tabBarNavigator';

const AppContainer = () => (
  <NavigationContainer
    linking={linking}
    onStateChange={onNavigationStateChange}
    ref={navigationRef}
  >
    <StackNavigator />
  </NavigationContainer>
);

AppContainer.displayName = 'AppContainer';

export default memo(AppContainer);
