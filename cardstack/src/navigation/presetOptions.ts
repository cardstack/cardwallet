import {
  CardStyleInterpolators,
  StackCardInterpolationProps,
  StackNavigationOptions,
} from '@react-navigation/stack';
import { Keyboard } from 'react-native';
import { ScreenNavigation } from './screens';
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

export const slideLeftToRightPreset: StackNavigationOptions = {
  cardStyleInterpolator: forSlideLeftToRight,
};

export const overlayPreset: StackNavigationOptions = {
  cardOverlayEnabled: true,
  cardStyle: { backgroundColor: colors.overlay },
  cardStyleInterpolator: forFade,
};

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
