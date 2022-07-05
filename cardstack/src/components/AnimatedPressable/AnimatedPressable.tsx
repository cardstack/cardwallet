import React, { memo, useCallback, useMemo, useRef } from 'react';
import {
  Pressable,
  PressableProps,
  Animated,
  ViewStyle,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import ReactNativeHapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';

import { Device } from '@cardstack/utils';

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

interface AnimatedPressableProps extends PressableProps {
  enableHapticFeedback?: boolean;
  hapticType?: HapticFeedbackTypes;
}

const AnimatedPressable = ({
  children,
  enableHapticFeedback = false,
  hapticType = 'selection',
  ...props
}: AnimatedPressableProps) => {
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

  const emitHapticFeedback = useCallback(() => {
    if (enableHapticFeedback && Device.supportsHapticFeedback) {
      ReactNativeHapticFeedback?.trigger(hapticType);
    }
  }, [enableHapticFeedback, hapticType]);

  const handleOnPress = useCallback(
    (e: GestureResponderEvent) => {
      emitHapticFeedback();

      props?.onPress?.(e);
    },
    [emitHapticFeedback, props]
  );

  const handleLongPress = useCallback(
    (e: GestureResponderEvent) => {
      emitHapticFeedback();

      props?.onLongPress?.(e);
    },
    [emitHapticFeedback, props]
  );

  return (
    <Animated.View style={animatedStyle} pointerEvents="box-none">
      <Pressable
        {...props}
        onPressIn={onPressAnimate(Scale.shrink)}
        onPressOut={onPressAnimate(Scale.grow)}
        onPress={handleOnPress}
        onLongPress={handleLongPress}
        delayLongPress={1000}
        testID="animated-pressable"
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

export default memo(AnimatedPressable);
