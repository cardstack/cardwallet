import React, { memo } from 'react';

import {
  Button,
  CenteredContainer,
  Container,
  Icon,
  Text,
} from '@cardstack/components';
import {
  CardwalletLogo,
  CARDWALLET_ICON_SIZE,
} from '@cardstack/components/CardwalletLogo';

import AppVersionStamp from '@rainbow-me/components/AppVersionStamp';

import { useWelcomeScreen } from './hooks';
import { strings } from './strings';

const layouts = {
  iconSize: 100,
  mobileIconWrapper: 85,
};

const WelcomeScreen = () => {
  const { onCreateWallet, onAddExistingWallet } = useWelcomeScreen();

  return (
    <CenteredContainer backgroundColor="black" flex={1} paddingBottom={10}>
      <CardwalletLogo />
      <CenteredContainer flex={1}>
        <Container height={layouts.mobileIconWrapper}>
          <Icon name="phone-pc" size={CARDWALLET_ICON_SIZE} />
        </Container>
        <Text
          color="buttonSecondaryBorder"
          fontSize={14}
          weight="bold"
          textAlign="center"
        >
          {strings.midtitle}
        </Text>
      </CenteredContainer>
      <CenteredContainer
        flex={0.5}
        justifyContent="space-around"
        marginBottom={2}
      >
        <Button onPress={onCreateWallet}>{strings.newAccBtn}</Button>
        <Button onPress={onAddExistingWallet} variant="primaryWhite">
          {strings.existingAccBtn}
        </Button>
      </CenteredContainer>
      <AppVersionStamp />
    </CenteredContainer>
  );
};

export default memo(WelcomeScreen);
