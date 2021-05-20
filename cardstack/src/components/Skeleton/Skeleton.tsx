import React, { useEffect } from 'react';
import { Animated } from 'react-native';

import { ContainerProps } from '../Container';
import { AnimatedContainer } from '../Animated';

export const Skeleton = (props: ContainerProps) => {
  const opacity = new Animated.Value(1);

  Animated.loop(
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 0.7,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ])
  ).start();

  return (
    <AnimatedContainer
      backgroundColor="borderGray"
      height={25}
      borderRadius={10}
      width="100%"
      opacity={opacity}
      {...props}
    />
  );
};
