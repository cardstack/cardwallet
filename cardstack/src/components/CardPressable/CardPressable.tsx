/**
 * This Wrap is specificly to solve an Android issue where opacity of several stacked
 * views blend badly together, which in our case, was occuring on all list row components.
 * It only wraps a simple Container component and adds props `needsOffscreenAlphaCompositing`
 * and `renderToHardwareTextureAndroid`.
 */

import React, {
  useCallback,
  useRef,
  useState,
  useMemo,
  ReactNode,
} from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ViewProps,
  PressableProps,
  ViewStyle,
  GestureResponderEvent,
} from 'react-native';

import {
  LayoutProps,
  SpacingProps,
  PositionProps,
  BorderProps,
  BackgroundColorProps,
} from '@shopify/restyle';
import ReactNativeHapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import { Theme } from '../../theme';
import { Device } from '@cardstack/utils';

enum Animate {
  out = 1.0,
  in = 0.2,
}

type RestyleProps = ViewProps &
  LayoutProps<Theme> &
  SpacingProps<Theme> &
  PositionProps<Theme> &
  BackgroundColorProps<Theme> &
  BorderProps<Theme>;

interface CardPressableProps extends PressableProps {
  enableHapticFeedback?: boolean;
  hapticType?: HapticFeedbackTypes;
  children: ReactNode;
}

export const CardPressable = ({
  children,
  enableHapticFeedback = false,
  hapticType = 'selection',
  onPress,
  ...rest
}: CardPressableProps & RestyleProps) => {
  const [animating, setAnimating] = useState(false);
  const animatedValue = useRef(new Animated.Value(Animate.out)).current;

  const onPressOpacity = useCallback(
    (toValue: Animate) => () => {
      setAnimating(true);
      Animated.timing(animatedValue, {
        toValue,
        duration: toValue === Animate.in ? 50 : 120,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(() => setAnimating(false));
    },
    [animatedValue]
  );

  const animatedStyle: Animated.WithAnimatedObject<ViewStyle> = useMemo(
    () => ({
      opacity: animatedValue,
    }),
    [animatedValue]
  );

  const handleOnPress = useCallback(
    (e: GestureResponderEvent) => {
      if (enableHapticFeedback && Device.supportsHapticFeedback) {
        ReactNativeHapticFeedback?.trigger(hapticType);
      }

      onPress?.(e);
    },
    [enableHapticFeedback, hapticType, onPress]
  );

  return (
    <Animated.View
      needsOffscreenAlphaCompositing
      renderToHardwareTextureAndroid={animating}
      style={animatedStyle}
      pointerEvents="box-none"
      {...rest}
    >
      <Pressable
        onPress={handleOnPress}
        onPressIn={onPressOpacity(Animate.in)}
        onPressOut={onPressOpacity(Animate.out)}
        testID="card-pressable"
        {...rest}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};
