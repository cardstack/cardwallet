import React, { memo } from 'react';

// @ts-expect-error ts doesn't know about Platform-specific extensions
import PlatformNavigator from '@rainbow-me/navigation/Routes';

import { TabBarFeatureProvider } from './tabBarNavigator';

const AppContainer = () => (
  <TabBarFeatureProvider>
    <PlatformNavigator />
  </TabBarFeatureProvider>
);

AppContainer.displayName = 'AppContainer';

export default memo(AppContainer);
