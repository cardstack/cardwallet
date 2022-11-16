import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated } from 'react-native';

import { CenteredContainer, Icon, Text } from '@cardstack/components';
import { shortNetworkName } from '@cardstack/utils';

import {
  useAccountSettings,
  useDimensions,
  useInternetStatus,
} from '@rainbow-me/hooks';

enum Toast {
  show = 1,
  hide = 0,
  distance = 60,
}

const springConfig = {
  damping: 14,
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.001,
  restSpeedThreshold: 0.001,
  stiffness: 121.6,
};

export const NetworkToast = () => {
  const isConnected = useInternetStatus();
  const { network } = useAccountSettings();

  const networkName = shortNetworkName(getConstantByNetwork('name', network));
  const { width: deviceWidth, height: deviceHeight } = useDimensions();

  const animation = useRef(new Animated.Value(0)).current;

  const animatedView = useMemo(
    () => ({
      opacity: animation.interpolate({
        inputRange: [Toast.hide, Toast.show],
        outputRange: [0, 1],
      }),
      transform: [
        {
          translateY: animation.interpolate({
            inputRange: [Toast.hide, Toast.show],
            outputRange: [Toast.distance, 0],
          }),
        },
      ],
    }),
    [animation]
  );

  useEffect(() => {
    Animated.spring(animation, {
      toValue: isConnected ? Toast.hide : Toast.show,
      useNativeDriver: true,
      ...springConfig,
    }).start();
  }, [animation, isConnected]);

  return (
    <Animated.View style={animatedView}>
      <CenteredContainer
        alignSelf="center"
        borderRadius={25}
        flexDirection="row"
        padding={2}
        position="absolute"
        zIndex={10}
        backgroundColor="overlay"
        maxWidth={deviceWidth * 0.9}
        bottom={!isConnected ? deviceHeight * 0.1 : -50}
      >
        <Icon color="white" marginRight={3} name="offline" iconSize="small" />
        <Text color="white" size="small" variant="bold">
          {networkName} (offline)
        </Text>
      </CenteredContainer>
    </Animated.View>
  );
};
