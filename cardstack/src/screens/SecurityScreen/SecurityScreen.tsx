import React, { memo } from 'react';
import { Switch } from 'react-native';

import {
  Container,
  useBiometricSwitch,
  IconProps,
} from '@cardstack/components';
import { strings as biometricsStrings } from '@cardstack/components/BiometricSwitch/strings';

import Item from './components/Item';
import { useSecurityScreen } from './useSecurityScreen';

const strings = {
  changePin: 'Change Pin',
};

const iconProps: IconProps = { name: 'lock' };

const SecurityScreen = () => {
  const {
    biometryIconProps,
    biometryLabel,
    isBiometryEnabled,
    biometryAvailable,
    trackColor,
    toggleBiometrySwitch,
  } = useBiometricSwitch();

  const { onPressChangePin } = useSecurityScreen();

  return (
    <Container flex={1} padding={5}>
      {biometryIconProps && biometryAvailable && (
        <Item
          label={biometricsStrings.switchLabel(biometryLabel)}
          iconProps={biometryIconProps}
          customRightItem={
            <Switch
              onValueChange={toggleBiometrySwitch}
              value={isBiometryEnabled}
              trackColor={trackColor}
            />
          }
        />
      )}
      <Item
        label={strings.changePin}
        iconProps={iconProps}
        onPress={onPressChangePin}
      />
    </Container>
  );
};

export default memo(SecurityScreen);
