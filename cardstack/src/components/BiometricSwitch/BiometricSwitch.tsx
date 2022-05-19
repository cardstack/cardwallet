import React from 'react';
import { Switch } from 'react-native';

import { Container, Text, Icon } from '@cardstack/components';
import { ColorTypes } from '@cardstack/theme';

import { strings } from './strings';
import { useBiometricSwitch } from './useBiometricSwitch';

type ThemeType = 'light' | 'dark';

const colorVariant: Record<ThemeType, ColorTypes> = {
  light: 'black',
  dark: 'white',
};

interface BiometricSwitchProps {
  variant: ThemeType;
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
      <Text color={colorVariant[variant]} variant="semibold" marginRight={2}>
        {strings.switchLabel} {biometryLabel}
      </Text>
      <Icon
        color={colorVariant[variant]}
        iconSize="medium"
        marginRight={1}
        {...iconProps}
      />
      <Switch onValueChange={toggleBiometrySwitch} value={isBiometryEnabled} />
    </Container>
  );
};
