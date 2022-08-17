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

import { Routes } from '.';

const SecureStackRouter = (stackOptions: StackRouterOptions) => {
  const router = StackRouter(stackOptions);

  const defaultGetStateForAction = router.getStateForAction;

  // Replaces stateForAction to avoid new routes when app is locked
  router.getStateForAction = (currentState, action, options) => {
    const currentRoute = currentState.routes[currentState.index].name;
    const isLocked = currentRoute === Routes.UNLOCK_SCREEN;
    // Get next state to check whether it's a new screen or not, handles push/navigate
    const nextState = defaultGetStateForAction(currentState, action, options);
    const screenBeingPushed = (nextState?.index || 0) > currentState.index;

    const preventNavigation = screenBeingPushed && isLocked;

    return preventNavigation ? currentState : nextState;
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
