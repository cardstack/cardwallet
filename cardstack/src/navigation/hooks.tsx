import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';

import Navigation from './Navigation';
import { MainRoutes, Routes } from './routes';
import { MainScreens, ScreenNavigation } from './screens';
import { StackType } from './types';

// Not a big fan of returning components inside hooks,
// but react-navigation does not allow components other than Screen

const getScreens = (
  routes: Record<string, string>,
  screens: Record<string, ScreenNavigation>,
  Stack: StackType
) =>
  Object.entries(screens).map(([name, props]) => (
    <Stack.Screen
      key={name}
      name={routes[name as keyof typeof routes]}
      {...props}
    />
  ));

export const useCardstackMainScreens = (Stack: StackType) =>
  getScreens(MainRoutes, MainScreens, Stack);

// Once we merge the routes, we can type it better
export const useDismissCurrentRoute = (routeName: string) => {
  const { goBack } = useNavigation();

  const checkAndDismissCurrentRoute = useCallback(() => {
    if (Navigation.getActiveRouteName() === routeName) {
      goBack();
    }
  }, [goBack, routeName]);

  return checkAndDismissCurrentRoute;
};

const defaulLoadingtMessage = {
  title: 'Processing Transaction',
};

interface ShowOverlayParams {
  title: string;
  subTitle?: string;
}

export const useLoadingOverlay = () => {
  const { navigate } = useNavigation();

  const dismissLoadingOverlay = useDismissCurrentRoute(Routes.LOADING_OVERLAY);

  const showLoadingOverlay = useCallback(
    ({ title, subTitle }: ShowOverlayParams = defaulLoadingtMessage) => {
      navigate(Routes.LOADING_OVERLAY, {
        title,
        subTitle,
      });
    },
    [navigate]
  );

  return { showLoadingOverlay, dismissLoadingOverlay };
};
