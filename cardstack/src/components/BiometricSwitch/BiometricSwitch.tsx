import React from 'react';
import { Switch } from 'react-native';

import { Container, Text, Icon } from '@cardstack/components';
import {
  colorStyleVariants,
  ThemeVariant,
} from '@cardstack/theme/colorStyleVariants';

import { strings } from './strings';
import { useBiometricSwitch } from './useBiometricSwitch';

interface BiometricSwitchProps {
  variant: ThemeVariant;
}

export const BiometricSwitch = ({ variant }: BiometricSwitchProps) => {
  const {
    iconProps,
    biometryLabel,
    isBiometryEnabled,
    biometryAvailable,
    toggleBiometrySwitch,
  } = useBiometricSwitch();

  // iconProps is undefined until biometry is ready.
  if (!biometryAvailable || !iconProps) return null;

  return (
    <Container flexDirection="row" alignItems="center">
      <Text
        color={colorStyleVariants.textColor[variant]}
        variant="semibold"
        marginRight={2}
      >
        {strings.switchLabel} {biometryLabel}
      </Text>
      <Icon
        color={colorStyleVariants.textColor[variant]}
        iconSize="medium"
        marginRight={2}
        {...iconProps}
      />
      <Switch onValueChange={toggleBiometrySwitch} value={isBiometryEnabled} />
    </Container>
  );
};
