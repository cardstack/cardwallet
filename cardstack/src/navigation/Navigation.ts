import {
  CommonActions,
  NavigationContainerRef,
  StackActions,
} from '@react-navigation/native';
import { RouteNames, StackParamsList } from 'globals';
import { get } from 'lodash';
import React from 'react';

export const navigationRef = React.createRef<
  NavigationContainerRef<StackParamsList>
>();

const getActiveRoute = () => navigationRef.current?.getCurrentRoute();

const getActiveOptions = () => navigationRef.current?.getCurrentOptions();

const getActiveRouteName = () => {
  const route = getActiveRoute();
  return get(route, 'name');
};

/**
 * Handle a navigation action or queue the action if navigation actions have been paused.
 * @param  {Object} action      The navigation action to run.
 */
function handleAction(
  name: RouteNames,
  params: Record<string, unknown> = {},
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
};
