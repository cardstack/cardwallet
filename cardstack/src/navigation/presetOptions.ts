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

export const overlayPreset: StackNavigationOptions = {
  cardOverlayEnabled: true,
  cardStyle: { backgroundColor: colors.overlay },
  cardStyleInterpolator: forFade,
};

export const dismissAndroidKeyboardOnClose: ScreenNavigation['listeners'] = {
  transitionStart: ({ data: { closing } }) => {
    closing && Device.isAndroid && Keyboard.dismiss();
  },
};
