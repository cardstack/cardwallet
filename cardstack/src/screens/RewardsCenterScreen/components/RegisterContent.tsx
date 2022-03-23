import React from 'react';
import { strings } from '../strings';
import { RewardRow, RewardsTitle } from '.';
import { Container, Button, InfoBanner } from '@cardstack/components';

interface RegisterContentProps {
  primaryText: string;
  subText: string;
  coinSymbol: string;
  onRegisterPress: () => void;
}

export const RegisterContent = ({
  onRegisterPress,
  primaryText,
  subText,
  coinSymbol,
}: RegisterContentProps) => (
  <Container alignItems="center" padding={5}>
    <RewardsTitle title={strings.register.title} paddingBottom={5} />
    <RewardRow
      coinSymbol={coinSymbol}
      primaryText={primaryText}
      subText={subText}
      paddingBottom={5}
      onClaimPress={() => {
        //pass
      }}
    />
    <Button onPress={onRegisterPress}>{strings.register.button}</Button>
    <Container paddingBottom={5} />
    <InfoBanner
      title={strings.register.infobanner.title}
      message={strings.register.infobanner.message}
    />
  </Container>
);
