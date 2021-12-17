import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/core';
import { MainRoutes, GlobalRoutes } from './routes';
import { MainScreens, GlobalScreens, ScreenNavigation } from './screens';
import { Navigation } from '@rainbow-me/navigation';

// Not a big fan of returning components inside hooks,
// but react-navigation does not allow components other than Screen

const getScreens = (
  routes: Record<string, string>,
  screens: Record<string, ScreenNavigation>,
  Stack: any
) =>
  Object.entries(screens).map(([name, props]) => (
    <Stack.Screen
      key={name}
      name={routes[name as keyof typeof routes]}
      {...props}
    />
  ));

export const useCardstackMainScreens = (Stack: any) =>
  getScreens(MainRoutes, MainScreens, Stack);

export const useCardstackGlobalScreens = (Stack: any) =>
  getScreens(GlobalRoutes, GlobalScreens, Stack);

const defaulLoadingtMessage = {
  title: 'Processing Transaction',
};

export const useLoadingOverlay = () => {
  const { navigate, goBack } = useNavigation();

  const showLoadingOverlay = useCallback(
    ({ title, subTitle } = defaulLoadingtMessage) => {
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
