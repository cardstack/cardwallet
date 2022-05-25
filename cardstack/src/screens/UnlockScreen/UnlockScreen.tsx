import React, { memo, useEffect, useMemo, useState } from 'react';
import {
  StatusBar,
  NativeModules,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

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
import { Device } from '@cardstack/utils';

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

  useEffect(() => {
    Device.isAndroid && NativeModules?.AndroidKeyboardAdjust.setAdjustPan();
  }, []);

  const statusBarStyle = useMemo(
    () => (variant === 'dark' ? 'light-content' : 'dark-content'),
    []
  );

  const biometryBottomPaddingStyle = useMemo(
    () => ({
      paddingTop: isSmallPhone ? 4 : 8,
    }),
    [isSmallPhone]
  );

  return (
    <>
      <StatusBar barStyle={statusBarStyle} />
      <SafeAreaView
        backgroundColor={colorStyleVariants.backgroundColor[variant]}
        flex={1}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Container flex={1} alignItems="center">
            <Container flex={0.35} alignItems="center" justifyContent="center">
              <CardwalletLogo />
            </Container>
            <Container
              flex={0.2}
              justifyContent="space-evenly"
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
                  <Container width="85%" paddingVertical={1}>
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
            </Container>
            <Container
              flex={0.45}
              width="80%"
              justifyContent="space-between"
              alignItems="center"
            >
              {biometryAvailable && (
                <Container {...biometryBottomPaddingStyle}>
                  <BiometricSwitch variant={variant} />
                </Container>
              )}
              <Button>{strings.login.button}</Button>
              <Text textAlign="center" color="grayText" size="xs">
                {strings.login.eraseMessage}
              </Text>
              <Touchable paddingBottom={4}>
                <Text color="teal" size="xs">
                  {strings.login.eraseLink}
                </Text>
              </Touchable>
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
