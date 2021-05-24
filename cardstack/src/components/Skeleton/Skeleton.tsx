import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

import { ContainerProps } from '../Container';
import { AnimatedContainer } from '../Animated';

const INITIAL_OPACITY = 0.25;
const FINAL_OPACITY = 0.15;
const ANIMATION_DURATION = 1000;

export const Skeleton = (props: ContainerProps) => {
  const opacity = useRef(new Animated.Value(INITIAL_OPACITY));

  useEffect(() => {
    const config = {
      duration: ANIMATION_DURATION,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    };

    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity.current, {
          ...config,
          toValue: FINAL_OPACITY,
        }),
        Animated.timing(opacity.current, {
          ...config,
          toValue: INITIAL_OPACITY,
        }),
      ])
    ).start();
  }, []);

  return (
    <AnimatedContainer
      backgroundColor="white"
      height={25}
      borderRadius={10}
      width="100%"
      opacity={opacity.current}
      {...props}
    />
  );
};
