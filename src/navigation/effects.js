import { Animated } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import colors from '../context/currentColors';
import { lightModeThemeColors } from '../styles/colors';
import { deviceUtils } from '../utils';
import { Routes } from '@cardstack/navigation/routes';

const statusBarHeight = getStatusBarHeight(true);
export const sheetVerticalOffset = statusBarHeight;
export let swapDetailsTransitionPosition = new Animated.Value(0);

const backgroundInterpolator = ({
  current: { progress: current },
  layouts: { screen },
}) => {
  const cardOpacity = current.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const translateY = current.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [screen.height, 0, 0],
  });

  return {
    cardStyle: {
      transform: [{ translateY }],
    },
    overlayStyle: {
      opacity: cardOpacity,
    },
  };
};

export const speedUpAndCancelStyleInterpolator = ({
  current: { progress: current },
  layouts: { screen },
}) => {
  const backgroundOpacity = current.interpolate({
    inputRange: [-1, 0, 0.925, 2],
    outputRange: [0, 0, 0.6, 1],
  });

  const translateY = current.interpolate({
    inputRange: [-1, 0, 1, 2],
    outputRange: [screen.height, screen.height, 0, 0],
  });

  return {
    cardStyle: {
      shadowColor: colors.themedColors.shadowBlack,
      shadowOffset: { height: 10, width: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 25,
      transform: [{ translateY }],
    },
    overlayStyle: {
      opacity: backgroundOpacity,
    },
  };
};

const exchangeStyleInterpolator = ({
  current: { progress: current },
  layouts: { screen },
}) => {
  const backgroundOpacity = current.interpolate({
    inputRange: [-1, 0, 0.925, 2],
    outputRange: [0, 0, 1, 1],
  });

  const translateY = current.interpolate({
    inputRange: [-1, 0, 1, 2],
    outputRange: [screen.height, screen.height, 0, 0],
  });

  return {
    cardStyle: {
      shadowColor: colors.themedColors.shadowBlack,
      shadowOffset: { height: 10, width: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 25,
      transform: [{ translateY }],
    },
    overlayStyle: {
      opacity: backgroundOpacity,
    },
  };
};

const expandStyleInterpolator = targetOpacity => ({
  current: { progress: current },
  layouts: { screen },
}) => {
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
      shadowColor: colors.themedColors.shadow,
      shadowOffset: { height: 10, width: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 25,
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
}) => {
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
      shadowColor: colors.themedColors.shadow,
      shadowOffset: { height: 10, width: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 25,
      transform: [{ translateY }],
    },
    overlayStyle: {
      backgroundColor: colors.themedColors.shadow,
      opacity: backgroundOpacity,
    },
  };
};

const sheetStyleInterpolator = (targetOpacity = 1) => ({
  current: { progress: current },
  layouts: { screen },
}) => {
  const backgroundOpacity = current.interpolate({
    inputRange: [-1, 0, 0.975, 2],
    outputRange: [0, 0, targetOpacity, targetOpacity],
  });

  const translateY = current.interpolate({
    extrapolate: 'clamp',
    inputRange: [0, 1],
    outputRange: [screen.height, 0],
  });

  return {
    cardStyle: {
      shadowColor: colors.themedColors.shadowBlack,
      shadowOffset: { height: 10, width: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 25,
      transform: [{ translateY }],
    },
    overlayStyle: {
      backgroundColor: lightModeThemeColors.shadowBlack,
      opacity: backgroundOpacity,
    },
  };
};

const swapDetailInterpolator = ({
  current: { progress: current },
  layouts: { screen },
}) => {
  // kinda hacky... but lets me expose the
  // stack's transitionPosition in an exportable way
  Animated.spring(swapDetailsTransitionPosition, {
    toValue: current,
    useNativeDriver: true,
  }).start();

  const backgroundOpacity = current.interpolate({
    inputRange: [-1, 0, 0.975, 2],
    outputRange: [0, 0, 0.6, 0.6],
  });

  const translateY = current.interpolate({
    inputRange: [0, 1],
    outputRange: [screen.height, 0],
  });

  return {
    cardStyle: {
      shadowColor: colors.themedColors.shadow,
      shadowOffset: { height: 10, width: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 25,
      transform: [{ translateY }],
    },
    overlayStyle: {
      backgroundColor: lightModeThemeColors.blueGreyDarker,
      opacity: backgroundOpacity,
      overflow: 'hidden',
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

const gestureResponseDistanceFactory = distance => ({
  vertical: distance,
});

const gestureResponseDistance = gestureResponseDistanceFactory(
  deviceUtils.dimensions.height
);

export const smallGestureResponseDistance = gestureResponseDistanceFactory(100);

export const backgroundPreset = {
  cardStyle: { backgroundColor: 'transparent' },
  cardStyleInterpolator: backgroundInterpolator,
  gestureResponseDistance,
};

export const exchangePreset = {
  cardOverlayEnabled: true,
  cardShadowEnabled: true,
  cardStyle: { backgroundColor: 'transparent' },
  cardStyleInterpolator: exchangeStyleInterpolator,
  cardTransparent: true,
  gestureDirection: 'vertical',
  gestureEnabled: true,
  gestureResponseDistance,
  transitionSpec: { close: closeSpec, open: sheetOpenSpec },
};

export const wcPromptPreset = {
  ...exchangePreset,
  cardStyleInterpolator: expandStyleInterpolator(0.7),
};

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

export const overlayExpandedPreset = {
  cardOverlayEnabled: true,
  cardShadowEnabled: false,
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

export const sheetPresetWithSmallGestureResponseDistance = navigation => ({
  ...sheetPreset(navigation),
  gestureResponseDistance: smallGestureResponseDistance,
});

export const sheetPreset = ({ route }) => {
  const shouldUseNonTransparentOverlay =
    route.params?.type === 'token' ||
    route.name === Routes.SEND_FLOW_EOA ||
    route.name === Routes.SEND_FLOW_DEPOT;

  return {
    cardOverlayEnabled: true,
    cardShadowEnabled: true,
    cardStyle: { backgroundColor: 'transparent' },
    cardStyleInterpolator: sheetStyleInterpolator(
      shouldUseNonTransparentOverlay ? 0.7 : 0
    ),
    cardTransparent: true,
    gestureDirection: 'vertical',
    gestureResponseDistance:
      route.params?.type === 'collectible'
        ? gestureResponseDistanceFactory(150)
        : gestureResponseDistance,
    transitionSpec: { close: closeSpec, open: sheetOpenSpec },
  };
};

export const settingsPreset = ({ route }) => ({
  ...sheetPreset({ route }),
  cardStyleInterpolator: sheetStyleInterpolator(0.7),
});

export const exchangeModalPreset = {
  cardStyle: { backgroundColor: 'transparent' },
  cardStyleInterpolator: () => ({
    overlayStyle: {
      backgroundColor: 'transparent',
    },
  }),
  gestureEnabled: true,
  gestureResponseDistance,
};

export const swapDetailsPreset = {
  cardOverlayEnabled: true,
  cardShadowEnabled: true,
  cardStyle: { backgroundColor: 'transparent' },
  cardStyleInterpolator: swapDetailInterpolator,
  cardTransparent: true,
  gestureDirection: 'vertical',
  gestureResponseDistance,
  transitionSpec: { close: closeSpec, open: openSpec },
};
