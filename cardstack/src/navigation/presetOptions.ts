import {
  CardStyleInterpolators,
  StackCardInterpolationProps,
  StackNavigationOptions,
} from '@react-navigation/stack';
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
