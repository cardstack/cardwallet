import React, { memo } from 'react';

import {
  CenteredContainer,
  ContainerProps,
  Icon,
  Text,
} from '@cardstack/components';

export const CARDWALLET_ICON_SIZE = 100;

const strings = {
  title: 'CARD WALLET',
  subtitle: 'by Cardstack',
};

export const CardwalletLogo = memo((props: ContainerProps) => (
  <CenteredContainer {...props}>
    <Icon name="cardstack" size={CARDWALLET_ICON_SIZE} />
    <Text marginTop={6} variant="welcomeScreen">
      {strings.title}
    </Text>
    <Text color="white" fontSize={14} weight="bold">
      {strings.subtitle}
    </Text>
  </CenteredContainer>
));
