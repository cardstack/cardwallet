import React from 'react';

import CardWalletLogo from '../../cardstack/src/assets/cardstackLogo.png';
import { Page } from '../components/layout';
import { Container, Image, Text } from '@cardstack/components';
import { colors } from '@cardstack/theme';

const DEFAULT_MESSAGE =
  'The app is going through scheduled maintenance, please try again later.';

export default function MaintenanceMode({ message }) {
  return (
    <Page color={colors.backgroundBlue} flex={1}>
      <Container
        alignItems="center"
        flex={1}
        justifyContent="center"
        testID="maintenance-modal"
      >
        <Image source={CardWalletLogo} />
        <Container padding={8}>
          <Text color="underlineGray" textAlign="center">
            {message || DEFAULT_MESSAGE}
          </Text>
        </Container>
      </Container>
    </Page>
  );
}
