import React from 'react';
import { Routes } from './routes';
import { Screens } from './screens';

// Not a big fan of returning components inside hooks,
// but react-navigation does not allow components other than Screen

export const useCardstackScreens = (Stack: any) => {
  const screens = Object.entries(
    Screens
  ).map(([name, { component, options }]) => (
    <Stack.Screen
      component={component}
      key={name}
      name={Routes[name as keyof typeof Routes]}
      options={options}
    />
  ));

  return screens;
};
