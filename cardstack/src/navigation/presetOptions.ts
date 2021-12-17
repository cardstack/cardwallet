import {
  CardStyleInterpolators,
  StackCardInterpolationProps,
  StackNavigationOptions,
} from '@react-navigation/stack';
import { Keyboard } from 'react-native';
import { StackNavigationEventMap } from '@react-navigation/stack/lib/typescript/src/types';
import { NavigationState, ScreenListeners } from '@react-navigation/core';
import { Device } from '@cardstack/utils';
import { colors } from '@cardstack/theme';

export const horizontalInterpolator: StackNavigationOptions = {
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  gestureDirection: 'horizontal',
};

const forFade = ({ current }: StackCardInterpolationProps) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

export const overlayPreset: StackNavigationOptions = {
  cardOverlayEnabled: true,
  cardStyle: { backgroundColor: colors.overlay },
  cardStyleInterpolator: forFade,
};

export const dismissAndroidKeyboardOnClose: ScreenListeners<
  NavigationState,
  StackNavigationEventMap
> = {
  transitionStart: ({ data: { closing } }) => {
    closing && Device.isAndroid && Keyboard.dismiss();
  },
};
