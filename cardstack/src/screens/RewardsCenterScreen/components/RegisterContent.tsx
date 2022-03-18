import React from 'react';
import { Alert } from 'react-native';
import { strings } from '../strings';
import { RewardRow } from './RewardRow';
import { Container, Button, Text } from '@cardstack/components';

interface RegisterContentProps {
  primaryText: string;
  subText: string;
  onRegisterPress: () => void;
}

export const RegisterContent = ({
  onRegisterPress,
  primaryText = '3,200 CARD.CPXD',
  subText = '$45.00 USD',
}: RegisterContentProps) => (
  <Container padding={5} alignItems="center">
    <Text
      weight="bold"
      letterSpacing={1.1}
      textTransform="uppercase"
      size="xxs"
      paddingBottom={5}
    >
      {strings.register.title}
    </Text>
    <RewardRow
      coinSymbol="CARD"
      primaryText={primaryText}
      subText={subText}
      paddingBottom={5}
    />
    <RewardRow
      coinSymbol="CARD"
      primaryText={primaryText}
      subText={subText}
      paddingBottom={5}
      onClaimPress={() => Alert.alert('Claim not available yet.')}
    />
    <Button onPress={onRegisterPress}>{strings.register.button}</Button>
  </Container>
);
