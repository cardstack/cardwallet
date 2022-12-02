import React from 'react';

import {
  CenteredContainer,
  Container,
  HorizontalDivider,
  Icon,
  NetworkBadge,
  Text,
} from '@cardstack/components';
import { appName } from '@cardstack/constants';

import { ContactAvatar } from '@rainbow-me/components/contacts';
import { useAccountProfile } from '@rainbow-me/hooks';

import { SectionHeaderText } from './components/SectionHeaderText';

export const HubAuthenticationDisplay = () => {
  return (
    <>
      <FromSection />
      <HorizontalDivider />
      <AuthenticateSection />
    </>
  );
};

const FromSection = () => {
  const {
    avatarKeyColor,
    accountName,
    accountSymbol,
    accountAddress,
  } = useAccountProfile();

  return (
    <Container marginTop={8} width="100%">
      <SectionHeaderText>FROM</SectionHeaderText>
      <Container paddingHorizontal={3} marginTop={4}>
        <Container flexDirection="row">
          <ContactAvatar
            color={avatarKeyColor}
            size="smaller"
            value={accountSymbol}
          />
          <Container marginLeft={4}>
            <Text weight="extraBold">{accountName}</Text>
            <NetworkBadge marginTop={2} />
            <Container maxWidth={180} marginTop={1}>
              <Text variant="subAddress">{accountAddress}</Text>
            </Container>
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

const AuthenticateSection = () => {
  return (
    <Container width="100%">
      <SectionHeaderText>AUTHENTICATE TO CARDSTACK HUB</SectionHeaderText>
      <CenteredContainer
        alignItems="center"
        paddingHorizontal={3}
        marginTop={10}
        flexDirection="column"
        width="100%"
      >
        <CenteredContainer width="100%" marginBottom={6} paddingRight={10}>
          <Icon name="user-check-square" />
        </CenteredContainer>
        <Text fontSize={15} weight="extraBold">
          Message Signing Request
        </Text>
        <Container maxWidth={300}>
          <Text fontSize={15} textAlign="center">
            I am signing this message to prove to Cardstack Hub that I am the
            owner of this address, so I can store and update information using
            the {appName}
          </Text>
        </Container>
      </CenteredContainer>
    </Container>
  );
};
