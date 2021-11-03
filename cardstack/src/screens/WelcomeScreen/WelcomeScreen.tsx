import React, { memo } from 'react';
import { useWelcomeScreen } from './hooks';
import { strings } from './strings';
import {
  Button,
  CenteredContainer,
  Container,
  Icon,
  Text,
} from '@cardstack/components';
import { useAppVersion } from '@rainbow-me/hooks';

const layouts = {
  iconSize: 100,
  mobileIconWrapper: 85,
};

const WelcomeScreen = () => {
  const { onCreateWallet, onAddExistingWallet } = useWelcomeScreen();
  const appVersion = useAppVersion();

  return (
    <CenteredContainer backgroundColor="black" flex={1} paddingBottom={10}>
      <CenteredContainer flex={1.5} justifyContent="flex-end">
        <Icon name="cardstack" size={layouts.iconSize} />
        <Text marginTop={6} variant="welcomeScreen">
          {strings.title}
        </Text>
        <Text color="white" fontSize={14} fontWeight="600">
          {strings.subtitle}
        </Text>
      </CenteredContainer>
      <CenteredContainer flex={1}>
        <Container height={layouts.mobileIconWrapper}>
          <Icon name="phone-pc" size={layouts.iconSize} />
        </Container>
        <Text
          color="buttonSecondaryBorder"
          fontSize={14}
          fontWeight="600"
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
      <Text color="grayText" fontSize={14} fontWeight="600" textAlign="center">
        Version {appVersion}
      </Text>
    </CenteredContainer>
  );
};

export default memo(WelcomeScreen);