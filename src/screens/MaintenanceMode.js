import React from 'react';

import { CenteredContainer, Container, Text } from '@cardstack/components';
import { CardwalletLogo } from '@cardstack/components/CardwalletLogo';

const DEFAULT_MESSAGE =
  'The app is going through scheduled maintenance, please try again later.';

export default function MaintenanceMode({ message }) {
  return (
    <CenteredContainer backgroundColor="backgroundBlue" flex={1}>
      <CardwalletLogo />
      <Container padding={8}>
        <Text color="underlineGray" textAlign="center">
          {message || DEFAULT_MESSAGE}
        </Text>
      </Container>
    </CenteredContainer>
  );
}
