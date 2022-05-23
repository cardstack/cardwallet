import React, { memo, useEffect, useMemo, useState } from 'react';
import { StatusBar, NativeModules, KeyboardAvoidingView } from 'react-native';

import {
  Button,
  Container,
  Icon,
  NavigationStackHeader,
  PinInput,
  Text,
  Image,
} from '@cardstack/components';
import {
  BiometricSwitch,
  useBiometricSwitch,
} from '@cardstack/components/BiometricSwitch';
import { colorStyleVariants } from '@cardstack/theme/colorStyleVariants';
import { Device } from '@cardstack/utils';

import cardwalletLogo from '../../assets/cardwalletLogoIntro.png';

import { strings } from './strings';

// To be replaced with states
const variant = 'dark';
const showFeedback = true;
const isValidPin = false;

const feedbackStatusProps = {
  success: {
    color: undefined, // uses default icon color
    iconName: 'check-circle' as const,
    label: strings.feedback.success,
  },
  error: {
    color: 'red' as const,
    iconName: 'error' as const,
    label: strings.feedback.error,
  },
};

const UnlockScreen = () => {
  const { biometryAvailable } = useBiometricSwitch();
  const [inputPin, setInputPin] = useState('');

  useEffect(() => {
    Device.isAndroid && NativeModules?.AndroidKeyboardAdjust.setAdjustPan();
  }, []);

  const feedbackProps = useMemo(
    () =>
      isValidPin ? feedbackStatusProps.success : feedbackStatusProps.error,
    []
  );

  const statusBarStyle = useMemo(
    () => (variant === 'dark' ? 'light-content' : 'dark-content'),
    []
  );

  return (
    <Container
      backgroundColor={colorStyleVariants.backgroundColor[variant]}
      flex={1}
    >
      <StatusBar barStyle={statusBarStyle} />
      <NavigationStackHeader
        canGoBack={true}
        backgroundColor={colorStyleVariants.backgroundColor[variant]}
      />
      <Container flex={1} alignItems="center">
        <Container flex={0.35} alignItems="center" justifyContent="center">
          <Image source={cardwalletLogo} />
        </Container>
        <Container
          justifyContent="center"
          flex={0.55}
          width="100%"
          alignItems="center"
        >
          <PinInput
            variant={variant}
            value={inputPin}
            onChangeText={setInputPin}
          />
          {showFeedback && (
            <Container width="85%">
              <Text
                fontSize={11}
                weight="semibold"
                color="error"
                textAlign="left"
              >
                {feedbackProps.label}
              </Text>
            </Container>
          )}
          {biometryAvailable && (
            <Container
              justifyContent="flex-end"
              flex={Device.isIOS ? 0.3 : 0.4}
              width="100%"
              alignItems="center"
            >
              <BiometricSwitch variant={variant} />
            </Container>
          )}
          <Button marginVertical={6}>{strings.login.button}</Button>
          <Container width="80%" justifyContent="center" alignItems="center">
            <Text
              paddingBottom={6}
              textAlign="center"
              color="grayText"
              size="xs"
            >
              {strings.login.eraseMessage}
            </Text>
            <Text paddingBottom={6} color="teal" size="xs">
              {strings.login.eraseLink}
            </Text>
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

export default memo(UnlockScreen);
