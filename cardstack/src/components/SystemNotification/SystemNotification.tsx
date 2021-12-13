import React, { useState } from 'react';
import { Animated, TouchableOpacity } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import downIcon from '../../assets/chevron-down.png';
import { AnimatedContainer, AnimatedText } from '../Animated';
import { Container, Icon, Text, IconName } from '@cardstack/components';
import { NOTIFICATION_KEY } from '@cardstack/utils';

const ANIMATION_DURATION = 150;
const CLOSED_HEIGHT = 40;
const OPENED_HEIGHT = 150;
const VISIBLE_OPACITY = 1;
const HIDDEN_OPACITY = 0;
const SUPPORTS_NATIVE_ANIM_DRIVER = !process.env.JEST_WORKER_ID;

type SystemNotificationType = 'info' | 'alert' | 'error';

const typeToIcon: {
  [key in SystemNotificationType]: IconName;
} = {
  alert: 'warning',
  error: 'error',
  info: 'info',
};

export interface SystemNotificationProps {
  closedText: string;
  openedHeaderText: string;
  openedBodyText: string;
  type?: SystemNotificationType;
}

export const SystemNotification = ({
  closedText,
  openedHeaderText,
  openedBodyText,
  type = 'info',
}: SystemNotificationProps) => {
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
      AsyncStorage.setItem(NOTIFICATION_KEY, 'false');
      Animated.parallel([
        Animated.timing(containerOpacity, {
          duration: ANIMATION_DURATION,
          toValue: HIDDEN_OPACITY,
          useNativeDriver: SUPPORTS_NATIVE_ANIM_DRIVER,
        }),
      ]).start(() => setIsVisible(false));
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
          testID="system-notification"
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
              <TouchableOpacity onPress={() => hideNotification()}>
                <Text weight="bold" textTransform="uppercase">
                  Don't Show again
                </Text>
              </TouchableOpacity>
            </Container>
          </Container>
        )}
      </AnimatedContainer>
    </TouchableOpacity>
  );
};
