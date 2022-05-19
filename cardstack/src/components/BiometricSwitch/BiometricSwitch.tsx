import React from 'react';
import { Switch } from 'react-native';

import { Container, Text, Icon } from '@cardstack/components';

import { strings } from './strings';
import { useBiometricSwitch } from './useBiometricSwitch';

export const BiometricSwitch = () => {
  const {
    iconProps,
    biometryLabel,
    isBiometryEnabled,
    toggleBiometrySwitch,
  } = useBiometricSwitch();

  // iconProps can only be undefined if biometry isn't ready or isn't available.
  if (!iconProps) return null;

  return (
    <Container flexDirection="row" alignItems="center">
      <Text variant="semibold" marginRight={2}>
        {strings.switchLabel} {biometryLabel}
      </Text>
      <Icon color="black" iconSize="medium" {...iconProps} />
      <Switch onValueChange={toggleBiometrySwitch} value={isBiometryEnabled} />
    </Container>
  );
};
