import {
  CardStyleInterpolators,
  StackCardInterpolationProps,
  StackNavigationOptions,
} from '@react-navigation/stack';
import { Animated, Keyboard } from 'react-native';

import { colors } from '@cardstack/theme';
import { Device } from '@cardstack/utils';

import { ScreenNavigation } from './screens';

export const horizontalInterpolator: StackNavigationOptions = {
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  gestureDirection: 'horizontal',
};

export const horizontalNonStackingInterpolator: StackNavigationOptions = {
  cardStyleInterpolator: ({ current, next, inverted, layouts: { screen } }) => {
    const translateFocused = Animated.multiply(
      current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [screen.width, 0],
      }),
      inverted
    );

    const translateUnfocused = next
      ? Animated.multiply(
          next.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -screen.width],
          }),
          inverted
        )
      : 0;

    return {
      cardStyle: {
        transform: [
          {
            translateX: Animated.add(translateFocused, translateUnfocused),
          },
        ],
      },
    };
  },
};

const forFade = ({ current }: StackCardInterpolationProps) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const forSlideLeftToRight = ({
  current,
  layouts: { screen },
}: StackCardInterpolationProps) => {
  const translateFocused = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-screen.width, 0],
  });

  return {
    cardStyle: {
      transform: [
        {
          translateX: translateFocused,
        },
      ],
    },
  };
};

const sheetStyleInterpolator = (targetOpacity: number) => ({
  current: { progress },
  layouts: { screen },
}: StackCardInterpolationProps) => {
  const backgroundOpacity = progress.interpolate({
    inputRange: [-1, 0, 0.975, 2],
    outputRange: [0, 0, targetOpacity, targetOpacity],
  });

  const translateY = progress.interpolate({
    extrapolate: 'clamp',
    inputRange: [0, 1],
    outputRange: [screen.height, 0],
  });

  return {
    cardStyle: {
      transform: [{ translateY }],
    },
    overlayStyle: {
      backgroundColor: 'black',
      opacity: backgroundOpacity,
    },
  };
};

const messageOverlayStyleInterpolator = (targetOpacity: number) => ({
  current: { progress },
}: StackCardInterpolationProps) => {
  const backgroundOpacity = progress.interpolate({
    inputRange: [-1, 0, 0.975, 2],
    outputRange: [0, 0, targetOpacity, targetOpacity],
  });

  const cardOpacity = progress.interpolate({
    inputRange: [-1, 0, 0.975, 2],
    outputRange: [0, 0, 1, 1],
  });

  const translateY = progress.interpolate({
    extrapolate: 'clamp',
    inputRange: [0, 1],
    outputRange: [75, 0],
  });

  return {
    cardStyle: {
      transform: [{ translateY }],
      opacity: cardOpacity,
    },
    overlayStyle: {
      backgroundColor: 'black',
      opacity: backgroundOpacity,
    },
  };
};

export const slideLeftToRightPreset: StackNavigationOptions = {
  cardStyleInterpolator: forSlideLeftToRight,
};

export const overlayPreset: StackNavigationOptions = {
  cardOverlayEnabled: true,
  cardStyle: { backgroundColor: colors.overlay },
  cardStyleInterpolator: forFade,
};

const sheetBackgroundOpacity = {
  full: 1,
  half: 0.5,
} as const;

interface SheetPresetOptions {
  bounce?: boolean;
  backgroundOpacity?: 'full' | 'half';
}

export const sheetPreset = ({
  bounce = true,
  backgroundOpacity = 'full',
}: SheetPresetOptions = {}): StackNavigationOptions => ({
  cardOverlayEnabled: true,
  cardShadowEnabled: true,
  cardStyle: { backgroundColor: 'transparent' },
  cardStyleInterpolator: sheetStyleInterpolator(
    sheetBackgroundOpacity[backgroundOpacity]
  ),
  gestureDirection: 'vertical',
  gestureResponseDistance:
    backgroundOpacity === 'full'
      ? Device.screenHeight * 0.3
      : Device.screenHeight,
  transitionSpec: {
    close: {
      animation: 'spring',
      config: {
        bounciness: 0,
        speed: 14,
      },
    },
    open: {
      animation: 'spring',
      config: {
        bounciness: bounce ? 6 : 0,
        speed: 25,
      },
    },
  },
});

export const messageOverlayPreset = ({
  backgroundOpacity = 'half',
}: SheetPresetOptions = {}): StackNavigationOptions => ({
  ...sheetPreset({ backgroundOpacity }),
  cardStyleInterpolator: messageOverlayStyleInterpolator(
    sheetBackgroundOpacity[backgroundOpacity]
  ),
});

/**
 * With keyboardHandlingEnabled disabled on Android Nav
 * we may need to manually dismiss the keyboard, iOS handles automatically
 * ref: https://github.com/react-navigation/react-navigation/issues/10080
 *  */
export const dismissKeyboardOnAndroid = () =>
  Device.isAndroid && Keyboard.dismiss();

export const dismissAndroidKeyboardOnClose: ScreenNavigation['listeners'] = {
  transitionStart: ({ data: { closing } }) => {
    closing && dismissKeyboardOnAndroid();
  },
};
