import React, { memo, useMemo, useState } from 'react';
import { StatusBar, Keyboard, TouchableWithoutFeedback } from 'react-native';

import {
  Button,
  Container,
  PinInput,
  SafeAreaView,
  Text,
  Touchable,
} from '@cardstack/components';
import {
  BiometricSwitch,
  useBiometricSwitch,
} from '@cardstack/components/BiometricSwitch';
import { CardwalletLogo } from '@cardstack/components/CardwalletLogo';
import { colorStyleVariants } from '@cardstack/theme/colorStyleVariants';

import { useAppVersion, useDimensions } from '@rainbow-me/hooks';

import { strings } from './strings';

// To be replaced with states
const variant = 'dark';
const pinError = true;

const UnlockScreen = () => {
  const { isSmallPhone } = useDimensions();
  const { biometryAvailable } = useBiometricSwitch();
  const appVersion = useAppVersion();
  const [inputPin, setInputPin] = useState('');

  const statusBarStyle = useMemo(
    () => (variant === 'dark' ? 'light-content' : 'dark-content'),
    []
  );

  const logoSize = useMemo(() => (isSmallPhone ? 'medium' : 'big'), [
    isSmallPhone,
  ]);

  const logoContaineFlex = useMemo(() => (isSmallPhone ? 1.5 : 2), [
    isSmallPhone,
  ]);

  return (
    <>
      <StatusBar barStyle={statusBarStyle} />
      <SafeAreaView
        backgroundColor={colorStyleVariants.backgroundColor[variant]}
        flex={1}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Container flex={1} alignItems="center">
            <Container
              flex={logoContaineFlex}
              alignItems="center"
              justifyContent="center"
            >
              <CardwalletLogo size={logoSize} />
            </Container>
            <Container
              flex={1}
              justifyContent="space-between"
              width="100%"
              alignItems="center"
            >
              <Container width="100%" alignItems="center">
                <PinInput
                  title={strings.pin.title}
                  autoFocus={false}
                  variant={variant}
                  value={inputPin}
                  onChangeText={setInputPin}
                />
                {pinError && (
                  <Container width="85%" paddingTop={1}>
                    <Text
                      fontSize={11}
                      weight="semibold"
                      color="error"
                      textAlign="left"
                    >
                      {strings.pin.error}
                    </Text>
                  </Container>
                )}
              </Container>
              {biometryAvailable && (
                <Container>
                  <BiometricSwitch variant={variant} />
                </Container>
              )}
            </Container>
            <Container
              flex={1}
              width="80%"
              justifyContent="space-around"
              alignItems="center"
            >
              <Button>{strings.login.button}</Button>
              <Text textAlign="center" color="grayText" size="xs">
                {strings.login.eraseMessage}
              </Text>
              <Touchable paddingBottom={4}>
                <Text color="teal" size="xs">
                  {strings.login.eraseLink}
                </Text>
              </Touchable>
            </Container>
            <Container flex={0.3} justifyContent="center">
              <Text paddingBottom={4} color="grayText" size="xs">
                Version {appVersion}
              </Text>
            </Container>
          </Container>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </>
  );
};

export default memo(UnlockScreen);
