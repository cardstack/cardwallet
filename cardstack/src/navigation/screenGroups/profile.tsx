import React from 'react';

import {
  horizontalNonStackingInterpolator,
  Routes,
} from '@cardstack/navigation';
import {
  ProfileNameScreen,
  ProfileSlugScreen,
  ProfilePurchaseScreen,
  ProfileChargeExplanationScreen,
} from '@cardstack/screens';

import { StackType } from '../types';

export const ProfileScreenGroup = ({ Stack }: { Stack: StackType }) => (
  <Stack.Group
    screenOptions={{
      ...horizontalNonStackingInterpolator,
      presentation: 'card',
      detachPreviousScreen: false,
    }}
  >
    <Stack.Screen component={ProfileSlugScreen} name={Routes.PROFILE_SLUG} />
    <Stack.Screen component={ProfileNameScreen} name={Routes.PROFILE_NAME} />
    <Stack.Screen
      component={ProfilePurchaseScreen}
      name={Routes.PROFILE_PURCHASE}
    />
    <Stack.Screen
      component={ProfileChargeExplanationScreen}
      name={Routes.PROFILE_CHARGE_EXPLANATION}
    />
  </Stack.Group>
);
