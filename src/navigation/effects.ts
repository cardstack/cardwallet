import { StackCardInterpolationProps } from '@react-navigation/stack';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { lightModeThemeColors } from '../styles/colors';
import { deviceUtils } from '../utils';

const statusBarHeight = getStatusBarHeight(true);
export const sheetVerticalOffset = statusBarHeight;

const expandStyleInterpolator = (targetOpacity: number) => ({
  current: { progress: current },
  layouts: { screen },
}: StackCardInterpolationProps) => {
  const backgroundOpacity = current.interpolate({
    inputRange: [-1, 0, 0.975, 2],
    outputRange: [0, 0, targetOpacity, targetOpacity],
  });

  const translateY = current.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [screen.height, 0, -screen.height / 3],
  });

  return {
    cardStyle: {
      transform: [{ translateY }],
    },
    overlayStyle: {
      backgroundColor: lightModeThemeColors.blueGreyDarker,
      opacity: backgroundOpacity,
    },
  };
};

const savingsStyleInterpolator = ({
  current: { progress: current },
  layouts: { screen },
}: StackCardInterpolationProps) => {
  const backgroundOpacity = current.interpolate({
    inputRange: [-1, 0, 0.975, 2],
    outputRange: [0, 0, 0.4, 0.4],
  });

  const translateY = current.interpolate({
    extrapolate: 'clamp',
    inputRange: [0, 1],
    outputRange: [screen.height, 0],
  });

  return {
    cardStyle: {
      shadowColor: 'black',
      shadowOffset: { height: 10, width: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 25,
      transform: [{ translateY }],
    },
    overlayStyle: {
      backgroundColor: 'black',
      opacity: backgroundOpacity,
    },
  };
};

const closeSpec = {
  animation: 'spring',
  config: {
    bounciness: 0,
    speed: 14,
  },
};

const openSpec = {
  animation: 'spring',
  config: {
    bounciness: 6,
    speed: 25,
  },
};

const sheetOpenSpec = {
  animation: 'spring',
  config: {
    bounciness: 0,
    speed: 22,
  },
};

const gestureResponseDistance = deviceUtils.dimensions.height;

export const expandedPreset = {
  cardOverlayEnabled: true,
  cardShadowEnabled: true,
  cardStyle: { backgroundColor: 'transparent', overflow: 'visible' },
  cardStyleInterpolator: expandStyleInterpolator(0.7),
  cardTransparent: true,
  gestureDirection: 'vertical',
  gestureResponseDistance,
  transitionSpec: { close: closeSpec, open: openSpec },
};

export const bottomSheetPreset = {
  cardOverlayEnabled: true,
  cardShadowEnabled: true,
  cardStyle: { backgroundColor: 'transparent' },
  cardStyleInterpolator: savingsStyleInterpolator,
  cardTransparent: true,
  gestureDirection: 'vertical',
  gestureResponseDistance,
  transitionSpec: { close: closeSpec, open: sheetOpenSpec },
};
