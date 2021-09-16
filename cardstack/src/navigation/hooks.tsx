import React from 'react';
import { StackNavigationOptions } from '@react-navigation/stack';
import { MainRoutes, GlobalRoutes } from './routes';
import { MainScreens, GlobalScreens } from './screens';

// Not a big fan of returning components inside hooks,
// but react-navigation does not allow components other than Screen

const getScreens = (
  routes: Record<string, string>,
  screens: Record<string, { component: any; options?: StackNavigationOptions }>,
  Stack: any
) =>
  Object.entries(screens).map(([name, { component, options }]) => (
    <Stack.Screen
      component={component}
      key={name}
      name={routes[name as keyof typeof routes]}
      options={options}
    />
  ));

export const useCardstackMainScreens = (Stack: any) =>
  getScreens(MainRoutes, MainScreens, Stack);

export const useCardstackGlobalScreens = (Stack: any) =>
  getScreens(GlobalRoutes, GlobalScreens, Stack);
