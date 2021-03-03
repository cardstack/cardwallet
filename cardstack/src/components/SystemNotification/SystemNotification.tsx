import React, { useState } from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
} from 'react-native';

import downIcon from '../../assets/chevron-down.png';
import infoIcon from '../../assets/info-blue.png';
import alertIcon from '../../assets/warning.png';
import errorIcon from '../../assets/error.png';
import {
  AnimatedContainer,
  AnimatedText,
  Container,
  Text,
} from '@cardstack/components';

const ANIMATION_DURATION = 150;
const CLOSED_HEIGHT = 40;
const OPENED_HEIGHT = 150;
const VISIBLE_OPACITY = 1;
const HIDDEN_OPACITY = 0;

type SystemNotificationType = 'info' | 'alert' | 'error';

const typeToIcon: {
  [key in SystemNotificationType]: ImageSourcePropType;
} = {
  alert: alertIcon,
  error: errorIcon,
  info: infoIcon,
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
  const [closedTextOpacity] = useState(new Animated.Value(VISIBLE_OPACITY));
  const [minHeight] = useState(new Animated.Value(CLOSED_HEIGHT));
  const [iconRotation] = useState(new Animated.Value(0));

  const openNotification = () => {
    Animated.parallel([
      Animated.timing(closedTextOpacity, {
        duration: ANIMATION_DURATION,
        toValue: HIDDEN_OPACITY,
        useNativeDriver: true,
      }),
      Animated.timing(iconRotation, {
        duration: ANIMATION_DURATION,
        toValue: 1,
        useNativeDriver: true,
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
        useNativeDriver: true,
      }),
      Animated.timing(iconRotation, {
        duration: ANIMATION_DURATION,
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(minHeight, {
        duration: ANIMATION_DURATION,
        toValue: CLOSED_HEIGHT,
        useNativeDriver: false,
      }),
    ]).start();

    setIsOpen(false);
  };

  const toggle = isOpen ? closeNotification : openNotification;

  return (
    <TouchableOpacity
      onPress={toggle}
      testID="system-notification"
      activeOpacity={1}
    >
      <AnimatedContainer
        backgroundColor="backgroundGray"
        padding={4}
        width="95%"
        borderRadius={10}
        minHeight={minHeight}
        margin={2}
      >
        <Container
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          marginBottom={isOpen ? 4 : 0}
        >
          <Container height={22} width={22} marginRight={2}>
            <Image
              source={typeToIcon[type]}
              resizeMode="contain"
              style={{
                height: '100%',
                width: '100%',
              }}
            />
          </Container>
          <AnimatedText fontSize={13} opacity={closedTextOpacity}>
            {closedText}
          </AnimatedText>
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
            <Text fontWeight="700">{openedHeaderText}</Text>
            <Text fontSize={13}>{openedBodyText}</Text>
          </Container>
        )}
      </AnimatedContainer>
    </TouchableOpacity>
  );
};
