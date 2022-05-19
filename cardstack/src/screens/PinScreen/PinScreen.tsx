import React, { memo, useEffect, useMemo, useState } from 'react';
import { StatusBar, NativeModules } from 'react-native';

import {
  Container,
  Icon,
  NavigationStackHeader,
  PinInput,
  Text,
} from '@cardstack/components';
import { colorStyleVariants } from '@cardstack/theme/colorStyleVariants';
import { Device } from '@cardstack/utils';

import { strings } from './strings';

// To be replaced with states
const variant = 'light';
const showFeedback = false;
const showBiometricSwitcher = true;
const isValidPin = true;

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
    () => (variant === 'light' ? 'dark-content' : 'light-content'),
    []
  );

  return (
    <Container
      backgroundColor={colorStyleVariants.backgroundColor[variant]}
      flex={1}
    >
      <StatusBar barStyle={statusBarStyle} />
      <NavigationStackHeader
        canGoBack={false}
        backgroundColor={colorStyleVariants.backgroundColor[variant]}
      />
      <Container flex={0.75} alignItems="center">
        <Container
          flex={0.3}
          width="70%"
          alignItems="center"
          justifyContent="flex-end"
        >
          <Text
            fontSize={22}
            weight="bold"
            color={colorStyleVariants.textColor[variant]}
          >
            {strings.flow.create.title}
          </Text>
          <Text
            fontSize={16}
            color={colorStyleVariants.secondaryTextColor[variant]}
            textAlign="center"
          >
            {strings.flow.create.subtitle}
          </Text>
        </Container>
        <Container
          justifyContent="center"
          flex={0.15}
          width="100%"
          alignItems="center"
        >
          {showFeedback && (
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
        {
          // SwitchPlaceholder
        }
        {showBiometricSwitcher && (
          <Container
            justifyContent="flex-end"
            flex={Device.isIOS ? 0.3 : 0.4}
            width="100%"
            alignItems="center"
          >
            <Container height={50} backgroundColor="red" width="50%" />
          </Container>
        )}
      </Container>
    </Container>
  );
};

export default memo(PinScreen);
