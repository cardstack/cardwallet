import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  ScaleTransform,
  StyleSheet,
  TranslateYTransform,
  useWindowDimensions,
} from 'react-native';

import {
  Button,
  CenteredContainer,
  Container,
  Input,
  SafeAreaView,
  Text,
} from '@cardstack/components';
import { colors, SPACING_MULTIPLIER } from '@cardstack/theme';
import { fontFamilyVariants } from '@cardstack/theme/fontFamilyVariants';
import { Device } from '@cardstack/utils';

import { deviceDimensions } from '@rainbow-me/hooks/useDimensions';

import ProfilePhonePreview from './components/ProfilePhonePreview';
import { strings } from './strings';
import { useProfileNameScreen } from './useProfileNameScreen';

enum Animation {
  keyboardOpening = 1,
  keyboardClosing = 0,
}

const layouts = {
  defaultPadding: 5,
  keyboardVerticalOffset: Device.isIOS ? 15 : 110,
};

const styles = StyleSheet.create({
  avoidViewContent: {
    backgroundColor: colors.backgroundDarkPurple,
    flexGrow: 1,
    justifyContent: 'space-around',
  },
  avoidViewContainer: {
    backgroundColor: colors.backgroundDarkPurple,
    flex: 0.4,
  },
  floatingFooter: {
    // Overrides parent container padding, to hide phone image
    marginHorizontal: -layouts.defaultPadding * SPACING_MULTIPLIER,
  },
});

export const ProfileNameScreen = () => {
  const {
    profileUrl,
    profileName,
    onSkipPress,
    onContinuePress,
    onChangeText,
  } = useProfileNameScreen();

  const animated = useRef(new Animated.Value(0)).current;

  const { height, width } = useWindowDimensions();

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

  const phonePreviewStyles = useMemo(() => {
    const {
      width: baseDeviceWidth,
      height: baseDeviceHeight,
    } = deviceDimensions.iphoneX;

    const constraints = {
      baseWidth: 230,
      baseHeight: 258,
      scaling: { iOS: 1.55, android: 1.8 },
    };

    const phonePrevWidth = Math.round(
      (width / baseDeviceWidth) * constraints.baseWidth
    );

    const phonePrevHeight = Math.round(
      (height / baseDeviceHeight) * constraints.baseHeight
    );

    const phonePrevAspectRatio = phonePrevHeight / phonePrevWidth;

    const scaleTo = Device.isIOS
      ? constraints.scaling.iOS
      : phonePrevAspectRatio * constraints.scaling.android;

    const transform: Animated.WithAnimatedArray<
      ScaleTransform | TranslateYTransform
    > = [
      {
        scale: animated.interpolate({
          inputRange: [Animation.keyboardClosing, Animation.keyboardOpening],
          outputRange: [1, scaleTo],
        }),
      },
    ];

    if (Device.isIOS) {
      const translateYTo = -(phonePrevAspectRatio * 65);

      transform.push({
        translateY: animated.interpolate({
          inputRange: [Animation.keyboardClosing, Animation.keyboardOpening],
          outputRange: [0, translateYTo],
        }),
      });
    }

    return {
      width: phonePrevWidth,
      height: phonePrevHeight,
      alignItems: 'center' as const,
      shadowColor: 'black',
      shadowRadius: 30,
      shadowOpacity: 1,
      transform,
    };
  }, [animated, height, width]);

  const animatedHeaderStyles = useMemo(
    () => ({
      flex: 0.4,
      justifyContent: 'space-between' as const,
      opacity: animated.interpolate({
        inputRange: [Animation.keyboardClosing, Animation.keyboardOpening],
        outputRange: [1, 0],
      }),
    }),
    [animated]
  );

  return (
    <SafeAreaView
      backgroundColor="backgroundDarkPurple"
      flex={1}
      paddingHorizontal={layouts.defaultPadding}
      justifyContent="space-between"
    >
      <Container flex={0.15} alignItems="flex-end" paddingVertical={2}>
        <Text
          fontSize={13}
          color="teal"
          onPress={onSkipPress}
          fontWeight="bold"
        >
          {strings.btns.skip}
        </Text>
      </Container>
      <Animated.View style={animatedHeaderStyles}>
        <Text fontSize={24} color="white" {...fontFamilyVariants.light}>
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
      <Container
        flex={0.65}
        alignItems="center"
        justifyContent="flex-end"
        paddingBottom={2}
      >
        <Animated.View style={phonePreviewStyles}>
          <ProfilePhonePreview
            profileUrl={profileUrl}
            profileName={profileName || strings.input.placeholder}
          />
        </Animated.View>
      </Container>
      <KeyboardAvoidingView
        behavior="position"
        style={styles.avoidViewContainer}
        contentContainerStyle={styles.avoidViewContent}
        keyboardVerticalOffset={-layouts.keyboardVerticalOffset}
      >
        <Container
          flex={1}
          paddingTop={2}
          backgroundColor="backgroundDarkPurple"
          justifyContent="space-around"
          style={styles.floatingFooter}
          paddingHorizontal={layouts.defaultPadding}
        >
          <Input
            color="teal"
            width="100%"
            fontSize={24}
            fontWeight="bold"
            placeholder={strings.input.placeholder}
            placeholderTextColor={colors.secondaryText}
            paddingBottom={4}
            onChangeText={onChangeText}
          />
          <Container width="80%" flex={1}>
            <Text fontSize={12} color="grayText">
              {strings.input.description}
            </Text>
          </Container>
        </Container>
      </KeyboardAvoidingView>
      <CenteredContainer flex={0.2} paddingBottom={2}>
        <Button disabled={!profileName} onPress={onContinuePress}>
          {strings.btns.continue}
        </Button>
      </CenteredContainer>
    </SafeAreaView>
  );
};

export default memo(ProfileNameScreen);
