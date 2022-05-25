import React, { memo } from 'react';

import { CenteredContainer, Icon, Text } from '@cardstack/components';

export const CARDWALLET_ICON_SIZE = 100;

const strings = {
  title: 'CARD WALLET',
  subtitle: 'by Cardstack',
};

export const CardwalletLogo = memo(() => (
  <CenteredContainer flex={1.5} justifyContent="flex-end">
    <Icon name="cardstack" size={CARDWALLET_ICON_SIZE} />
    <Text marginTop={6} variant="welcomeScreen">
      {strings.title}
    </Text>
    <Text color="white" fontSize={14} weight="bold">
      {strings.subtitle}
    </Text>
  </CenteredContainer>
));
