import React, { useState } from 'react';
import { Animated, TouchableOpacity } from 'react-native';

import downIcon from '../../assets/chevron-down.png';
import { AnimatedContainer, AnimatedText } from '../Animated';
import { Container, Icon, Text, IconName } from '@cardstack/components';

const ANIMATION_DURATION = 150;
const CLOSED_HEIGHT = 40;
const OPENED_HEIGHT = 285;
const VISIBLE_OPACITY = 1;
const HIDDEN_OPACITY = 0;
const SUPPORTS_NATIVE_ANIM_DRIVER = !process.env.JEST_WORKER_ID;

type CollapsibleBannerType = 'info' | 'alert' | 'error';

const typeToIcon: {
  [key in CollapsibleBannerType]: IconName;
} = {
  alert: 'warning',
  error: 'error',
  info: 'info',
};

export interface CollapsibleBannerProps {
  closedText: string | React.ReactNode;
  openedHeaderText: string | React.ReactNode;
  openedBodyText: string | React.ReactNode;
  closeForeverButtonText: string;
  closeForeverPress?: () => void;
  type?: CollapsibleBannerType;
}

export const CollapsibleBanner = ({
  closedText,
  openedHeaderText,
  openedBodyText,
  closeForeverButtonText,
  closeForeverPress,
  type = 'info',
}: CollapsibleBannerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [closedTextOpacity] = useState(new Animated.Value(VISIBLE_OPACITY));
  const [containerOpacity] = useState(new Animated.Value(VISIBLE_OPACITY));
  const [minHeight] = useState(new Animated.Value(CLOSED_HEIGHT));
  const [iconRotation] = useState(new Animated.Value(0));

  const openNotification = () => {
    Animated.parallel([
      Animated.timing(closedTextOpacity, {
        duration: ANIMATION_DURATION,
        toValue: HIDDEN_OPACITY,
        useNativeDriver: SUPPORTS_NATIVE_ANIM_DRIVER,
      }),
      Animated.timing(iconRotation, {
        duration: ANIMATION_DURATION,
        toValue: 1,
        useNativeDriver: SUPPORTS_NATIVE_ANIM_DRIVER,
      }),
      Animated.timing(minHeight, {
        duration: ANIMATION_DURATION,
        toValue: OPENED_HEIGHT,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setIsOpen(true);
    });
  };

  const closeNotification = () => {
    Animated.parallel([
      Animated.timing(closedTextOpacity, {
        duration: ANIMATION_DURATION,
        toValue: VISIBLE_OPACITY,
        useNativeDriver: SUPPORTS_NATIVE_ANIM_DRIVER,
      }),
      Animated.timing(iconRotation, {
        duration: ANIMATION_DURATION,
        toValue: 0,
        useNativeDriver: SUPPORTS_NATIVE_ANIM_DRIVER,
      }),
      Animated.timing(minHeight, {
        duration: ANIMATION_DURATION,
        toValue: CLOSED_HEIGHT,
        useNativeDriver: false,
      }),
    ]).start();

    setIsOpen(false);
  };

  const hideNotification = () => {
    try {
      Animated.parallel([
        Animated.timing(containerOpacity, {
          duration: ANIMATION_DURATION,
          toValue: HIDDEN_OPACITY,
          useNativeDriver: SUPPORTS_NATIVE_ANIM_DRIVER,
        }),
      ]).start(() => {
        setIsVisible(false);
        closeForeverPress?.();
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  const toggle = isOpen ? closeNotification : openNotification;

  return (
    <TouchableOpacity onPress={toggle} activeOpacity={1}>
      <AnimatedContainer
        backgroundColor="backgroundGray"
        padding={4}
        borderRadius={10}
        minHeight={minHeight}
        opacity={containerOpacity}
        visible={isVisible}
        marginHorizontal={4}
        marginVertical={2}
      >
        <Container
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          marginBottom={isOpen ? 4 : 0}
          testID="collapsible-banner"
        >
          <Icon iconSize="medium" marginRight={2} name={typeToIcon[type]} />
          <AnimatedText opacity={closedTextOpacity}>{closedText}</AnimatedText>
          <Container height={14} width={14} marginLeft={2}>
            <Animated.Image
              source={downIcon}
              resizeMode="contain"
              style={{
                height: '100%',
                width: '100%',
                transform: [
                  {
                    rotate: iconRotation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '180deg'],
                    }),
                  },
                ],
              }}
            />
          </Container>
        </Container>
        {isOpen && (
          <Container>
            <Text fontWeight="700" marginBottom={2}>
              {openedHeaderText}
            </Text>
            <Text size="body">{openedBodyText}</Text>
            <Container marginTop={12} alignItems="flex-end">
              {closeForeverButtonText && (
                <TouchableOpacity onPress={() => hideNotification()}>
                  <Text weight="bold" textTransform="uppercase">
                    {closeForeverButtonText}
                  </Text>
                </TouchableOpacity>
              )}
            </Container>
          </Container>
        )}
      </AnimatedContainer>
    </TouchableOpacity>
  );
};
