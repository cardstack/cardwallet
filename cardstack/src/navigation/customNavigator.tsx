import {
  createNavigatorFactory,
  DefaultNavigatorOptions,
  ParamListBase,
  StackActionHelpers,
  StackNavigationState,
  StackRouter,
  StackRouterOptions,
  useNavigationBuilder,
} from '@react-navigation/native';
import { StackNavigationOptions, StackView } from '@react-navigation/stack';
import {
  StackNavigationConfig,
  StackNavigationEventMap,
} from '@react-navigation/stack/lib/typescript/src/types';
import React from 'react';

import store from '@rainbow-me/redux/store';

import { NonAuthRoutes, Routes } from '.';

const SecureStackRouter = (stackOptions: StackRouterOptions) => {
  const router = StackRouter(stackOptions);

  const defaultGetStateForAction = router.getStateForAction;

  // Replaces stateForAction to avoid new routes when app is locked
  router.getStateForAction = (currentState, action, options) => {
    const { isAuthorized } = store.getState().authSlice;

    // Get next state to check new screen
    const nextState = defaultGetStateForAction(currentState, action, options);

    const nextRoute = nextState?.routes[nextState.index || 0].name;

    const isOnNonAuthFlow = currentState.routes.some(
      route => route.name === NonAuthRoutes.WELCOME_SCREEN
    );

    const willLock = nextRoute === Routes.UNLOCK_SCREEN;

    const allowNavigation = isAuthorized || isOnNonAuthFlow || willLock;

    return allowNavigation ? nextState : currentState;
  };

  return router;
};

type Props = DefaultNavigatorOptions<
  ParamListBase,
  StackNavigationState<ParamListBase>,
  StackNavigationOptions,
  StackNavigationEventMap
> &
  StackRouterOptions &
  StackNavigationConfig;

const StackNavigator = ({
  id,
  initialRouteName,
  children,
  screenListeners,
  screenOptions,
  ...rest
}: Props) => {
  const {
    state,
    descriptors,
    navigation,
    NavigationContent,
  } = useNavigationBuilder<
    StackNavigationState<ParamListBase>,
    StackRouterOptions,
    StackActionHelpers<ParamListBase>,
    StackNavigationOptions,
    StackNavigationEventMap
  >(SecureStackRouter, {
    id,
    initialRouteName,
    children,
    screenListeners,
    screenOptions,
  });

  return (
    <NavigationContent>
      <StackView
        {...rest}
        state={state}
        descriptors={descriptors}
        navigation={navigation}
      />
    </NavigationContent>
  );
};

export const createCustomStackNavigator = createNavigatorFactory<
  StackNavigationState<ParamListBase>,
  StackNavigationOptions,
  StackNavigationEventMap,
  typeof StackNavigator
>(StackNavigator);
