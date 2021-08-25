import {
  CardStyleInterpolators,
  StackNavigationOptions,
} from '@react-navigation/stack';

export const horizontalInterpolator: StackNavigationOptions = {
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  gestureDirection: 'horizontal',
};
