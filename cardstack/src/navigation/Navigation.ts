import {
  CommonActions,
  NavigationContainerRef,
  StackActions,
} from '@react-navigation/native';
import { get } from 'lodash';
import React from 'react';
import { Value } from 'react-native-reanimated';

import { Routes } from '@cardstack/navigation';

export const navigationRef = React.createRef<NavigationContainerRef>();

const transitionPosition = new Value(0);

const getActiveRoute = () => navigationRef.current?.getCurrentRoute();

const getActiveOptions = () => navigationRef.current?.getCurrentOptions();

const getActiveRouteName = () => {
  const route = getActiveRoute();
  return get(route, 'name');
};

type RoutesType = typeof Routes;
type RouteKeys = keyof RoutesType;

/**
 * Handle a navigation action or queue the action if navigation actions have been paused.
 * @param  {Object} action      The navigation action to run.
 */
function handleAction(
  name: RoutesType[RouteKeys],
  params: any,
  replace = false
) {
  if (!navigationRef.current?.dispatch) return;

  const action = (replace ? StackActions.replace : CommonActions.navigate)(
    name,
    params
  );

  navigationRef.current?.dispatch(action);
}

export default {
  getActiveOptions,
  getActiveRoute,
  getActiveRouteName,
  handleAction,
  transitionPosition,
};
