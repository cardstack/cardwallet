import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

import { ContainerProps } from '../Container';
import { AnimatedContainer } from '../Animated';

export const Skeleton = (props: ContainerProps) => {
  const opacity = useRef(new Animated.Value(1));

  useEffect(() => {
    const config = {
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    };

    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity.current, {
          ...config,
          toValue: 0.5,
        }),
        Animated.timing(opacity.current, {
          ...config,
          toValue: 1,
        }),
      ])
    ).start();
  }, []);

  return (
    <AnimatedContainer
      backgroundColor="borderGray"
      height={25}
      borderRadius={10}
      width="100%"
      opacity={opacity.current}
      {...props}
    />
  );
};
