import React, { memo } from 'react';
import { StatusBar, Keyboard, TouchableWithoutFeedback } from 'react-native';

import {
  Button,
  Container,
  PinInput,
  SafeAreaView,
  Text,
  Touchable,
} from '@cardstack/components';
import { BiometricSwitch } from '@cardstack/components/BiometricSwitch';
import { CardwalletLogo } from '@cardstack/components/CardwalletLogo';
import { colorStyleVariants } from '@cardstack/theme/colorStyleVariants';

import AppVersionStamp from '@rainbow-me/components/AppVersionStamp';

import { strings } from './strings';
import { useUnlockScreen } from './useUnlockScreen';

const variant = 'dark';

const UnlockScreen = () => {
  const {
    inputPin,
    setInputPin,
    pinInvalid,
    retryBiometricAuth,
    onResetWalletPress,
    authenticateBiometrically,
  } = useUnlockScreen();

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView
        backgroundColor={colorStyleVariants.backgroundColor[variant]}
        flex={1}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Container flex={1} alignItems="center">
            <Container flex={1.5} alignItems="center" justifyContent="center">
              <CardwalletLogo variant={variant} proportionalSize />
            </Container>
            <Container
              flex={0.9}
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
                {!!pinInvalid && (
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
              <Container paddingBottom={1}>
                <BiometricSwitch variant={variant} />
              </Container>
            </Container>
            <Container
              flex={1}
              paddingTop={4}
              width="80%"
              justifyContent="flex-end"
              alignItems="center"
            >
              {retryBiometricAuth && (
                <Button onPress={authenticateBiometrically}>
                  {strings.login.button}
                </Button>
              )}
              <Container flex={1} justifyContent="flex-end" alignItems="center">
                <Text
                  textAlign="center"
                  color="grayText"
                  size="xs"
                  paddingBottom={5}
                >
                  {strings.login.eraseMessage}
                </Text>
                <Touchable onPress={onResetWalletPress}>
                  <Text color="teal" size="xs">
                    {strings.login.eraseLink}
                  </Text>
                </Touchable>
              </Container>
            </Container>
            <Container flex={0.2} justifyContent="flex-end" paddingBottom={1}>
              <AppVersionStamp />
            </Container>
          </Container>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </>
  );
};

export default memo(UnlockScreen);
