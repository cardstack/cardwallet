/**
 * This Wrap is specificly to solve an Android issue where opacity of several stacked
 * views blend badly together, which in our case, was occuring on all list row components.
 * It only wraps a simple Container component and adds props `needsOffscreenAlphaCompositing`
 * and `renderToHardwareTextureAndroid`.
 */

import React, { useCallback, useRef, useState, ReactNode } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ViewProps,
  PressableProps,
} from 'react-native';

import {
  LayoutProps,
  SpacingProps,
  PositionProps,
  BorderProps,
  BackgroundColorProps,
} from '@shopify/restyle';

import { Theme } from '../../theme';

enum Opacity {
  opaque = 1.0,
  translucent = 0.2,
}

type RestyleProps = ViewProps &
  LayoutProps<Theme> &
  SpacingProps<Theme> &
  PositionProps<Theme> &
  BackgroundColorProps<Theme> &
  BorderProps<Theme>;

interface CardPressableProps extends PressableProps {
  children: ReactNode;
}

export const CardPressable = ({
  children,
  onPress,
  disabled,
  ...rest
}: CardPressableProps & RestyleProps) => {
  const [animating, setAnimating] = useState(false);
  const animatedValue = useRef(new Animated.Value(Opacity.opaque)).current;

  const onPressAnimate = useCallback(
    (toValue: Opacity) => () => {
      setAnimating(true);
      Animated.timing(animatedValue, {
        toValue,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    },
    [animatedValue]
  );

  // const animatedStyle: Animated.WithAnimatedObject<ViewStyle> = useMemo(
  //   () => ({
  //     ...styles,
  //     transform: [
  //       {
  //         scale: animatedValue.interpolate({
  //           inputRange: [Scale.grow, Scale.shrink],
  //           outputRange: [scaleRatio.full, scaleRatio.decreased],
  //         }),
  //       },
  //     ],
  //   }),
  //   [animatedValue]
  // );

  return (
    <Animated.View
      needsOffscreenAlphaCompositing
      renderToHardwareTextureAndroid={animating}
      {...rest}
    >
      <Pressable
        onPress={onPress}
        disabled={disabled}
        // onPressIn={onPressAnimate(Scale.shrink)}
        // onPressOut={onPressAnimate(Scale.grow)}
        {...rest}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};
