import React from 'react';
import { strings } from '../strings';
import { RewardRow } from './RewardRow';
import { Container, Button, Text, InfoBanner } from '@cardstack/components';

interface RegisterContentProps {
  primaryText?: string;
  subText?: string;
  coinSymbol?: string;
  onRegisterPress: () => void;
}

export const RegisterContent = ({
  onRegisterPress,
  primaryText = 'X CARD.CPXD',
  subText = '$Y USD',
  coinSymbol = 'CARD',
}: RegisterContentProps) => (
  <Container alignItems="center">
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
      coinSymbol={coinSymbol}
      primaryText={primaryText}
      subText={subText}
      paddingBottom={5}
    />
    <Button onPress={onRegisterPress}>{strings.register.button}</Button>
    <Container paddingBottom={5} />
    <InfoBanner
      title={strings.register.infobanner.title}
      message={strings.register.infobanner.message}
    />
  </Container>
);
