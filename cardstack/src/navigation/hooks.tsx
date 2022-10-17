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
  const { goBack, getParent, getState } = useNavigation();

  const checkAndDismissCurrentRoute = useCallback(() => {
    const parent = getParent();

    if (Navigation.getActiveRouteName() === routeName) {
      // Theres a bug in our navigator implementation where in some unknown circunstances
      // the pushed screen has a lower stack index than it's parent, causing goBack
      // to pop the parent and not the the active route. The validation
      // below is a workaround the issue.
      if (parent && parent.getState().index > getState().index) {
        parent.goBack();
      } else {
        goBack();
      }
    }
  }, [getParent, goBack, getState, routeName]);

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
