import React, { memo, useCallback, useMemo, useRef } from 'react';
import {
  Pressable,
  PressableProps,
  Animated,
  ViewStyle,
  StyleSheet,
} from 'react-native';

enum Scale {
  grow = 0,
  shrink = 1,
}

const scaleRatio = {
  full: 1,
  decreased: 0.9,
};

const styles = StyleSheet.create({
  centeredContainer: {
    flexShrink: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const AnimatedPressable = ({ children, ...props }: PressableProps) => {
  const animatedValue = useRef(new Animated.Value(Scale.grow)).current;

  const onPressAnimate = useCallback(
    (toValue: Scale) => () => {
      Animated.spring(animatedValue, {
        toValue,
        bounciness: 3,
        speed: 100,
        useNativeDriver: true,
      }).start();
    },
    [animatedValue]
  );

  const animatedStyle: Animated.WithAnimatedObject<ViewStyle> = useMemo(
    () => ({
      ...styles,
      transform: [
        {
          scale: animatedValue.interpolate({
            inputRange: [Scale.grow, Scale.shrink],
            outputRange: [scaleRatio.full, scaleRatio.decreased],
          }),
        },
      ],
    }),
    [animatedValue]
  );

  return (
    <Animated.View style={animatedStyle} pointerEvents="box-none">
      <Pressable
        {...props}
        onPressIn={onPressAnimate(Scale.shrink)}
        onPressOut={onPressAnimate(Scale.grow)}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

export default memo(AnimatedPressable);
