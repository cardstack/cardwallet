import React, { memo } from 'react';

import { CenteredContainer, Container, Text } from '@cardstack/components';
import { CardwalletLogo } from '@cardstack/components/CardwalletLogo';

const DEFAULT_MESSAGE =
  'The app is going through scheduled maintenance, please try again later.';

const MaintenanceMode = ({ message = DEFAULT_MESSAGE }) => (
  <CenteredContainer backgroundColor="backgroundBlue" flex={1}>
    <CardwalletLogo />
    <Container padding={8}>
      <Text color="underlineGray" textAlign="center">
        {message}
      </Text>
    </Container>
  </CenteredContainer>
);

export default memo(MaintenanceMode);
