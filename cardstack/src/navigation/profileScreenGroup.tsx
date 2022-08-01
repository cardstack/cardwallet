import React from 'react';

import {
  ProfileNameScreen,
  ProfileSlugScreen,
  ProfilePurchaseCTA,
  ProfileChargeExplanationScreen,
} from '@cardstack/screens';

import { StackType } from './types';

import { horizontalNonStackingInterpolator, Routes } from '.';

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
      component={ProfilePurchaseCTA}
      name={Routes.PROFILE_PURCHASE_CTA}
    />
    <Stack.Screen
      component={ProfileChargeExplanationScreen}
      name={Routes.PROFILE_CHARGE_EXPLANATION}
    />
  </Stack.Group>
);
