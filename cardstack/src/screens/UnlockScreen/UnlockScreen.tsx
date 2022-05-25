import React, { memo, useEffect, useMemo, useState } from 'react';
import {
  StatusBar,
  NativeModules,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Button,
  Container,
  NavigationStackHeader,
  PinInput,
  SafeAreaView,
  Text,
  Touchable,
  Image,
} from '@cardstack/components';
import {
  BiometricSwitch,
  useBiometricSwitch,
} from '@cardstack/components/BiometricSwitch';
import { colorStyleVariants } from '@cardstack/theme/colorStyleVariants';
import { Device } from '@cardstack/utils';

import { useAppVersion, useDimensions } from '@rainbow-me/hooks';

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
  const insets = useSafeAreaInsets();
  const { isSmallPhone } = useDimensions();
  const { biometryAvailable } = useBiometricSwitch();
  const appVersion = useAppVersion();
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

  const biometryBottomPaddingStyle = useMemo(
    () => ({
      paddingTop: isSmallPhone ? 4 : 8,
      style: {
        paddingBottom: insets.bottom * 2,
      },
    }),
    [insets, isSmallPhone]
  );

  return (
    <>
      <StatusBar barStyle={statusBarStyle} />
      <NavigationStackHeader
        canGoBack={true}
        backgroundColor={colorStyleVariants.backgroundColor[variant]}
      />
      <SafeAreaView
        backgroundColor={colorStyleVariants.backgroundColor[variant]}
        flex={1}
        edges={['bottom']}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Container flex={1} alignItems="center">
            <Container flex={0.3} alignItems="center" justifyContent="center">
              <Image source={cardwalletLogo} />
            </Container>
            <Container
              flex={0.7}
              justifyContent="flex-end"
              width="100%"
              alignItems="center"
            >
              <Container width="100%" alignItems="center">
                <PinInput
                  autoFocus={false}
                  variant={variant}
                  value={inputPin}
                  onChangeText={setInputPin}
                />
                {showFeedback && (
                  <Container width="85%" paddingVertical={1}>
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
                  <Container {...biometryBottomPaddingStyle}>
                    <BiometricSwitch variant={variant} />
                  </Container>
                )}
              </Container>
              <Button marginVertical={6}>{strings.login.button}</Button>
              <Container
                width="80%"
                justifyContent="center"
                alignItems="center"
              >
                <Text
                  paddingBottom={6}
                  textAlign="center"
                  color="grayText"
                  size="xs"
                >
                  {strings.login.eraseMessage}
                </Text>
                <Touchable onPress={console.log}>
                  <Text paddingBottom={6} color="teal" size="xs">
                    {strings.login.eraseLink}
                  </Text>
                </Touchable>
                <Text paddingBottom={4} color="grayText" size="xs">
                  Version {appVersion}
                </Text>
              </Container>
            </Container>
          </Container>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </>
  );
};

export default memo(UnlockScreen);
