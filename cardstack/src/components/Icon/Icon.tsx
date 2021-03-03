import React from 'react';

import { ImageSourcePropType } from 'react-native';
import { Container, Image } from '@cardstack/components';

type IconSize = 'small' | 'medium' | 'large';

const iconSizeToValue = {
  small: 15,
  medium: 22,
  large: 30,
};

interface IconProps {
  /** specify the size using T-Shirt sizes */
  iconSize?: IconSize;
  /** if none of the default sizes work for what you need, you can use this to override */
  size?: number;
  source: ImageSourcePropType;
}

export const Icon = ({ iconSize = 'large', size, source }: IconProps) => {
  const widthAndHeight = size || iconSizeToValue[iconSize];

  return (
    <Container width={widthAndHeight} height={widthAndHeight} marginRight={2}>
      <Image
        source={source}
        resizeMode="contain"
        style={{ height: '100%', width: '100%' }}
      />
    </Container>
  );
};
