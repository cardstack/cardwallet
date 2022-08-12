import { ResponsiveValue } from '@shopify/restyle';
import React from 'react';

import { Text, CenteredContainer } from '@cardstack/components';
import { Theme } from '@cardstack/theme';

// import { ColorTypes } from '@cardstack/theme';

interface FloatingTagProps {
  theme?: {
    backgroundColor: ResponsiveValue<keyof Theme['colors'], Theme>;
    color: ResponsiveValue<keyof Theme['colors'], Theme>;
  };
  copy: string;
}

export const FloatingTag = ({ theme, copy }: FloatingTagProps) => (
  <CenteredContainer
    backgroundColor={theme?.backgroundColor || 'tealDark'}
    borderRadius={5}
    height={17}
    width={64}
  >
    <Text variant="floatingTag" color={theme?.color || 'white'}>
      {copy}
    </Text>
  </CenteredContainer>
);
