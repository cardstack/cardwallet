import React, { memo, useMemo } from 'react';
import { StatusBar } from 'react-native';

import {
  Container,
  Icon,
  InPageHeader,
  PinInput,
  SafeAreaView,
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
    <SafeAreaView
      backgroundColor={colorStyleVariants.backgroundColor[variant]}
      flex={1}
      paddingHorizontal={5}
    >
      <StatusBar barStyle={statusBarStyle} />
      <InPageHeader showSkipButton={false} showLeftIcon={canGoBack} />

      <Container flex={1} alignItems="center">
        <Container flex={0.15} width="85%" alignSelf="flex-start">
          <Text
            fontSize={22}
            variant="pageHeader"
            color={colorStyleVariants.textColor[variant]}
          >
            {strings.flow?.[flow]}
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
            flex={Device.isIOS ? 0.15 : 0.25}
            width="100%"
            alignItems="center"
          >
            <BiometricSwitch variant={variant} />
          </Container>
        )}
      </Container>
    </SafeAreaView>
  );
};

export default memo(PinScreen);
