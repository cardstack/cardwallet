import React from 'react';
import { strings } from '../strings';
import { RewardRow } from './RewardRow';
import { NoRewardMessage } from './NoRewardMessage';
import { Container, Button, Text, InfoBanner } from '@cardstack/components';

interface RegisterContentProps {
  primaryText?: string;
  subText?: string;
  onRegisterPress: () => void;
}

export const RegisterContent = ({
  onRegisterPress,
  primaryText = '3,200 CARD.CPXD',
  subText = '$45.00 USD',
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
    <NoRewardMessage paddingBottom={2} />
    <RewardRow
      coinSymbol="CARD"
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
