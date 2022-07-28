import React, { memo, useCallback, useMemo, useRef } from 'react';
import {
  Pressable,
  PressableProps,
  Animated,
  ViewStyle,
  GestureResponderEvent,
  Easing,
} from 'react-native';
import ReactNativeHapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';

import { delayLongPressMs } from '@cardstack/constants';
import { Device } from '@cardstack/utils';

enum Opacity {
  fadeIn = 0,
  fadeOut = 1,
}

const opacityRange = {
  full: 1,
  decreased: 0.7,
};

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
  const animatedValue = useRef(new Animated.Value(Opacity.fadeOut)).current;

  const onPressAnimate = useCallback(
    (toValue: Opacity) => () => {
      Animated.timing(animatedValue, {
        toValue,
        duration: 100,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start();
    },
    [animatedValue]
  );

  const animatedStyle: Animated.WithAnimatedObject<ViewStyle> = useMemo(
    () => ({
      opacity: animatedValue.interpolate({
        inputRange: [Opacity.fadeIn, Opacity.fadeOut],
        outputRange: [opacityRange.decreased, opacityRange.full],
      }),
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
        onPressIn={onPressAnimate(Opacity.fadeIn)}
        onPressOut={onPressAnimate(Opacity.fadeOut)}
        onPress={handleOnPress}
        onLongPress={handleLongPress}
        delayLongPress={delayLongPressMs}
        testID="animated-pressable"
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

export default memo(AnimatedPressable);
