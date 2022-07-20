import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  ScaleTransform,
  TranslateYTransform,
} from 'react-native';

import {
  Button,
  CenteredContainer,
  Container,
  Input,
  SafeAreaView,
  Text,
} from '@cardstack/components';
import { colors } from '@cardstack/theme';
import { Device, screenHeight, screenWidth } from '@cardstack/utils';

import ProfilePhonePreview from './components/ProfilePhonePreview';
import { strings } from './strings';

enum Animation {
  keyboardOpening = 1,
  keyboardClosing = 0,
}

const aspectRatio = screenHeight / screenWidth;

export const ProfileNameScreen = () => {
  const animated = useRef(new Animated.Value(0)).current;

  const animatePhoneOnKeyboardEvent = useCallback(
    (toValue: Animation) => () => {
      Animated.timing(animated, {
        toValue,
        duration: 250,
        useNativeDriver: true,
      }).start();
    },
    [animated]
  );

  useEffect(() => {
    const subscriptionShow = Keyboard.addListener(
      Device.keyboardEventWillShow,
      animatePhoneOnKeyboardEvent(Animation.keyboardOpening)
    );

    const subscriptionHide = Keyboard.addListener(
      Device.keyboardEventWillHide,
      animatePhoneOnKeyboardEvent(Animation.keyboardClosing)
    );

    return () => {
      subscriptionShow.remove();
      subscriptionHide.remove();
    };
  }, [animatePhoneOnKeyboardEvent]);

  const transform = useMemo(() => {
    const transformArray: Animated.WithAnimatedArray<
      ScaleTransform | TranslateYTransform
    > = [
      {
        scale: animated.interpolate({
          inputRange: [0, 1],
          outputRange: [1, Device.isIOS ? 1.3 : 1.4],
        }),
      },
    ];

    if (Device.isIOS) {
      transformArray.push({
        translateY: animated.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -screenHeight * 0.091],
        }),
      });
    }

    return transformArray;
  }, [animated]);

  const opacity = useMemo(
    () => ({
      opacity: animated.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      }),
    }),
    [animated]
  );

  return (
    <SafeAreaView
      backgroundColor="backgroundDarkPurple"
      flex={1}
      paddingHorizontal={5}
      justifyContent="space-between"
    >
      <Container flex={0.1} alignItems="flex-end" paddingVertical={2}>
        <Text fontSize={13} color="teal" fontFamily="OpenSans-Bold">
          {strings.btns.skip}
        </Text>
      </Container>
      <Animated.View
        style={[
          {
            justifyContent: 'space-between',
            flex: 0.45,
          },
          opacity,
        ]}
      >
        <Text fontSize={24} color="white" fontFamily="OpenSans-Light">
          {strings.header}
        </Text>
        <CenteredContainer>
          <Text fontSize={12} color="grayText" paddingBottom={2}>
            {strings.editColor}
          </Text>
          <Button variant="smallTertiary" height={40} width={110}>
            Placeholder
          </Button>
        </CenteredContainer>
      </Animated.View>
      <Container flex={1} alignItems="center" justifyContent="flex-start">
        <Animated.View
          style={{
            flex: 1,
            alignItems: 'center',
            transform,
          }}
        >
          <ProfilePhonePreview profileUrl="mandello.card.yxz" />
        </Animated.View>
      </Container>
      <KeyboardAvoidingView
        behavior="position"
        keyboardVerticalOffset={Device.isIOS ? -12 : -100}
      >
        <Container
          backgroundColor="backgroundDarkPurple"
          style={{
            paddingTop: screenHeight * 0.01 * aspectRatio,
            marginHorizontal: -(5 * 4),
          }}
          paddingHorizontal={5}
        >
          <Input
            color="teal"
            width="100%"
            fontSize={24}
            fontFamily="OpenSans-Regular"
            fontWeight="bold"
            placeholder={strings.input.placeholder}
            placeholderTextColor={colors.secondaryText}
            paddingBottom={4}
          />
          <Container width="80%" paddingBottom={10}>
            <Text fontSize={12} color="grayText" fontFamily="OpenSans-Regular">
              {strings.input.description}
            </Text>
          </Container>
        </Container>
      </KeyboardAvoidingView>
      <CenteredContainer flex={0.2} paddingBottom={2}>
        <Button> {strings.btns.continue}</Button>
      </CenteredContainer>
    </SafeAreaView>
  );
};

export default memo(ProfileNameScreen);
