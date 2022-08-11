import { useIsFocused } from '@react-navigation/native';
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
  InPageHeader,
  Input,
  SafeAreaView,
  Text,
  Touchable,
} from '@cardstack/components';
import { cardSpaceDomain } from '@cardstack/constants';
import { colors, SPACING_MULTIPLIER } from '@cardstack/theme';
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
  keyboardVerticalOffset: Device.isIOS ? 15 : 95,
  dot: {
    size: 24,
    radius: 50,
  },
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
    profile,
    onContinuePress,
    onChangeText,
    onPressEditColor,
    isEditing,
    isBlocked,
  } = useProfileNameScreen();

  const animated = useRef(new Animated.Value(0)).current;

  const { height, width } = useWindowDimensions();

  const isFocused = useIsFocused();

  const animatePhoneOnKeyboardEvent = useCallback(
    (toValue: Animation) => () => {
      // avoid animating on background of color picker
      if (!isFocused) {
        return;
      }

      Animated.timing(animated, {
        toValue,
        duration: 250,
        useNativeDriver: true,
      }).start();
    },
    [animated, isFocused]
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

  const colorDotStyle = useMemo(() => ({ backgroundColor: profile.color }), [
    profile.color,
  ]);

  const pageTitle = useMemo(
    () => (isEditing ? strings.header.update : strings.header.create),
    [isEditing]
  );

  const btnLabel = useMemo(
    () => (isEditing ? strings.btns.save : strings.btns.continue),
    [isEditing]
  );

  return (
    <SafeAreaView
      backgroundColor="backgroundDarkPurple"
      flex={1}
      paddingHorizontal={layouts.defaultPadding}
      justifyContent="space-between"
    >
      <InPageHeader skipAmount={2} showSkipButton={!isEditing} />
      <Animated.View style={animatedHeaderStyles}>
        <Text variant="pageHeader">{pageTitle}</Text>
        <CenteredContainer>
          <Text fontSize={12} color="grayText" paddingBottom={2}>
            {strings.editColor}
          </Text>
          <Touchable
            borderColor="borderBlue"
            borderWidth={1}
            borderRadius={20}
            padding={2}
            onPress={onPressEditColor}
          >
            <Container flexDirection="row" justifyContent="space-between">
              <Container
                borderRadius={layouts.dot.radius}
                height={layouts.dot.size}
                width={layouts.dot.size}
                style={colorDotStyle}
                borderColor="white"
                borderWidth={2}
              />
              <Text paddingLeft={3} fontSize={18} color="grayText">
                {profile.color}
              </Text>
            </Container>
          </Touchable>
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
            url={`${profile.slug}${cardSpaceDomain}`}
            name={profile.name || strings.input.placeholder}
            color={profile.color}
            textColor={profile['text-color']}
          />
        </Animated.View>
      </Container>
      <KeyboardAvoidingView
        enabled={isFocused}
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
            value={profile.name}
          />
          <Container width="80%" flex={1}>
            <Text fontSize={12} color="grayText">
              {strings.input.description}
            </Text>
          </Container>
        </Container>
      </KeyboardAvoidingView>
      <CenteredContainer flex={0.2} paddingBottom={2}>
        <Button blocked={isBlocked} onPress={onContinuePress}>
          {btnLabel}
        </Button>
      </CenteredContainer>
    </SafeAreaView>
  );
};

export default memo(ProfileNameScreen);
