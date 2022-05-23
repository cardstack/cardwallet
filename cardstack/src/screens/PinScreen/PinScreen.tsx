import React, { memo, useEffect, useMemo } from 'react';
import { StatusBar, NativeModules } from 'react-native';

import {
  Container,
  Icon,
  NavigationStackHeader,
  PinInput,
  Text,
} from '@cardstack/components';
import { BiometricSwitch } from '@cardstack/components/BiometricSwitch';
import { colorStyleVariants } from '@cardstack/theme/colorStyleVariants';
import { Device } from '@cardstack/utils';

import { strings } from './strings';
import { usePinScreen } from './usePinScreen';

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

const PinScreen = () => {
  const {
    canGoBack,
    showBiometricSwitcher,
    isValidPin,
    variant,
    setInputPin,
    inputPin,
    flow,
  } = usePinScreen();

  useEffect(() => {
    Device.isAndroid && NativeModules?.AndroidKeyboardAdjust.setAdjustPan();
  }, []);

  const feedbackProps = useMemo(
    () =>
      isValidPin ? feedbackStatusProps.success : feedbackStatusProps.error,
    [isValidPin]
  );

  const statusBarStyle = useMemo(
    () => (variant === 'light' ? 'dark-content' : 'light-content'),
    [variant]
  );

  return (
    <Container
      backgroundColor={colorStyleVariants.backgroundColor[variant]}
      flex={1}
    >
      <StatusBar barStyle={statusBarStyle} />
      <NavigationStackHeader
        canGoBack={canGoBack}
        backgroundColor={colorStyleVariants.backgroundColor[variant]}
      />
      <Container flex={0.7} alignItems="center" justifyContent="center">
        <Container
          flex={0.2}
          width="70%"
          alignItems="center"
          justifyContent="flex-start"
        >
          <Text
            fontSize={22}
            weight="bold"
            color={colorStyleVariants.textColor[variant]}
          >
            {strings.flow?.[flow]?.title}
          </Text>
          <Text
            fontSize={16}
            color={colorStyleVariants.secondaryTextColor[variant]}
            textAlign="center"
          >
            {strings.flow?.[flow]?.subtitle}
          </Text>
        </Container>
        <Container
          justifyContent="center"
          flex={0.15}
          width="100%"
          alignItems="center"
        >
          {isValidPin !== null && (
            <Container flexDirection="row">
              <Text
                fontSize={14}
                weight="bold"
                color={colorStyleVariants.textColor[variant]}
                textAlign="center"
              >
                {feedbackProps.label}
              </Text>
              <Icon
                name={feedbackProps.iconName}
                size={20}
                paddingLeft={2}
                backgroundColor={colorStyleVariants.backgroundColor[variant]}
                color={feedbackProps.color}
              />
            </Container>
          )}
        </Container>
        <PinInput
          variant={variant}
          value={inputPin}
          onChangeText={setInputPin}
        />
        {showBiometricSwitcher && (
          <Container
            justifyContent="flex-end"
            flex={Device.isIOS ? 0.25 : 0.4}
            width="100%"
            alignItems="center"
          >
            <BiometricSwitch variant={variant} />
          </Container>
        )}
      </Container>
    </Container>
  );
};

export default memo(PinScreen);
