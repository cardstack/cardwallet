import React, { memo, useMemo } from 'react';

import {
  Button,
  CenteredContainer,
  Container,
  SafeAreaView,
  Icon,
  Text,
} from '@cardstack/components';
import { CardwalletLogo } from '@cardstack/components/CardwalletLogo';

import AppVersionStamp from '@rainbow-me/components/AppVersionStamp';
import { useDimensions } from '@rainbow-me/hooks';

import { useWelcomeScreen } from './hooks';
import { strings } from './strings';

const MID_IMAGE_SIZE = 100;
const MID_IMAGE_WRAPPER = 85;

const WelcomeScreen = () => {
  const { onCreateWallet, onAddExistingWallet } = useWelcomeScreen();
  const { isSmallPhone } = useDimensions();

  const logoSize = useMemo(() => (isSmallPhone ? 'medium' : 'big'), [
    isSmallPhone,
  ]);

  return (
    <SafeAreaView
      backgroundColor="black"
      flex={1}
      alignItems="center"
      paddingBottom={4}
    >
      <CenteredContainer flex={1} justifyContent="flex-end">
        <CardwalletLogo size={logoSize} />
      </CenteredContainer>
      <CenteredContainer flex={0.5}>
        <Container height={MID_IMAGE_WRAPPER}>
          <Icon name="phone-pc" size={MID_IMAGE_SIZE} />
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
      <CenteredContainer flex={0.5} justifyContent="flex-end" paddingBottom={6}>
        <Button marginBottom={4} onPress={onCreateWallet}>
          {strings.newAccBtn}
        </Button>
        <Button onPress={onAddExistingWallet} variant="primaryWhite">
          {strings.existingAccBtn}
        </Button>
      </CenteredContainer>
      <AppVersionStamp />
    </SafeAreaView>
  );
};

export default memo(WelcomeScreen);
