import React from 'react';

import { ImageSourcePropType } from 'react-native';
import { Container, Image } from '@cardstack/components';

interface IconProps {
  size?: number;
  source: ImageSourcePropType;
}

export const Icon = ({ size = 30, source }: IconProps) => (
  <Container width={size} height={size} marginRight={2}>
    <Image source={source} resizeMode="contain" height="100%" width="100%" />
  </Container>
);
