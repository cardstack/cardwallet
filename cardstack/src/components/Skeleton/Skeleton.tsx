import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

import { ContainerProps } from '../Container';
import { AnimatedContainer } from '../Animated';

const INITIAL_OPACITY = 0.25;
const INITIAL_OPACITY_LIGHT = 1;
const FINAL_OPACITY = 0.15;
const FINAL_OPACITY_LIGHT = 0.5;
const ANIMATION_DURATION = 1000;

export const Skeleton = (props: ContainerProps & { light?: boolean }) => {
  const { light } = props;

  const opacity = useRef(
    new Animated.Value(light ? INITIAL_OPACITY_LIGHT : INITIAL_OPACITY)
  );

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
          toValue: light ? FINAL_OPACITY_LIGHT : FINAL_OPACITY,
        }),
        Animated.timing(opacity.current, {
          ...config,
          toValue: light ? INITIAL_OPACITY_LIGHT : INITIAL_OPACITY,
        }),
      ])
    ).start();
  }, [light]);

  return (
    <AnimatedContainer
      backgroundColor={light ? 'lightSkeleton' : 'white'}
      height={25}
      borderRadius={10}
      width="100%"
      opacity={opacity.current}
      {...props}
    />
  );
};
