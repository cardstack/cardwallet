import { NavigationContainer } from '@react-navigation/native';
import React, { memo } from 'react';

import { useAuthSelectorAndActions } from '@cardstack/redux/authSlice';

import { navigationRef } from './Navigation';
import { onNavigationStateChange } from './onNavigationStateChange';
import { linking } from './screens';
import { StackNavigator } from './tabBarNavigator';

const AppContainer = () => {
  const { isAuthorized } = useAuthSelectorAndActions();

  const hasLinking = isAuthorized ? linking : undefined;

  return (
    <NavigationContainer
      linking={hasLinking}
      onStateChange={onNavigationStateChange}
      ref={navigationRef}
    >
      <StackNavigator />
    </NavigationContainer>
  );
};

AppContainer.displayName = 'AppContainer';

export default memo(AppContainer);
