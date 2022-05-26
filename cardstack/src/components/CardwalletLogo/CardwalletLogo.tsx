import React, { memo } from 'react';

import { CenteredContainer, Icon, Text } from '@cardstack/components';

type CardwalletLogoSizes = 'big' | 'medium';

interface Props {
  size?: CardwalletLogoSizes;
}

export const DEFAULT_CARDWALLET_ICON_SIZE = 100;

const strings = {
  title: 'CARD WALLET',
  subtitle: 'by Cardstack',
};

const sizes = {
  big: {
    iconSize: DEFAULT_CARDWALLET_ICON_SIZE,
    title: {
      fontSize: 24,
    },
    subtitle: {
      fontSize: 14,
    },
  },
  medium: {
    iconSize: 80,
    title: {
      fontSize: 20,
    },
    subtitle: {
      fontSize: 12,
    },
  },
};

export const CardwalletLogo = memo(({ size = 'big' }: Props) => (
  <CenteredContainer>
    <Icon name="cardstack" size={sizes[size].iconSize} />
    <Text marginTop={6} variant="welcomeScreen" {...sizes[size].title}>
      {strings.title}
    </Text>
    <Text color="white" weight="bold" {...sizes[size].subtitle}>
      {strings.subtitle}
    </Text>
  </CenteredContainer>
));
