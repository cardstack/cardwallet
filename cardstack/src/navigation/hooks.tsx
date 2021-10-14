import React, { useCallback, useRef } from 'react';
import { StackNavigationOptions } from '@react-navigation/stack';
import {
  StackActions,
  useRoute,
  useNavigation,
  useNavigationState,
} from '@react-navigation/core';
import { MainRoutes, GlobalRoutes } from './routes';
import { MainScreens, GlobalScreens } from './screens';
import { Navigation } from '@rainbow-me/navigation';

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

export const useLoadingOverlay = () => {
  const { navigate, goBack } = useNavigation();

  const showLoadingOverlay = useCallback(
    ({ title, subTitle }) => {
      navigate(MainRoutes.LOADING_OVERLAY, {
        title,
        subTitle,
      });
    },
    [navigate]
  );

  const dismissLoadingOverlay = useCallback(() => {
    if (Navigation.getActiveRouteName() === MainRoutes.LOADING_OVERLAY) {
      goBack();
    }
  }, [goBack]);

  return { showLoadingOverlay, dismissLoadingOverlay };
};
