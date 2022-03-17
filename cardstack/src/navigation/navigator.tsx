import React, { memo } from 'react';

import { TabBarFeatureProvider } from './tabBarNavigator';
// @ts-expect-error ts doesn't know about Platform-specific extensions
import PlatformNavigator from '@rainbow-me/navigation/Routes';

const AppContainer = () => (
  <TabBarFeatureProvider>
    <PlatformNavigator />
  </TabBarFeatureProvider>
);

AppContainer.displayName = 'AppContainer';

export default memo(AppContainer);
