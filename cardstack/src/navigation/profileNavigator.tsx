import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import {
  ProfileNameScreen,
  ProfileSlugScreen,
  ProfilePurchaseCTA,
} from '@cardstack/screens';

import { horizontalInterpolator, Routes } from '.';

export const ProfileNavigation = ({
  Stack,
}: {
  Stack: ReturnType<typeof createStackNavigator>;
}) => (
  <Stack.Group screenOptions={horizontalInterpolator}>
    <Stack.Screen component={ProfileNameScreen} name={Routes.PROFILE_NAME} />
    <Stack.Screen component={ProfileSlugScreen} name={Routes.PROFILE_SLUG} />
    <Stack.Screen
      component={ProfilePurchaseCTA}
      name={Routes.PROFILE_PURCHASE_CTA}
    />
    <Stack.Screen
      component={() => {
        // TODO replace this with the correct screen
        return null;
      }}
      name={Routes.PROFILE_CHARGE_EXPLANATION}
    />
  </Stack.Group>
);
