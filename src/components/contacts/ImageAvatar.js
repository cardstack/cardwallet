import React, { useMemo } from 'react';
import { Image } from 'react-native';
import styled from 'styled-components';

import { avatarColor, colors } from '@cardstack/theme';

import { borders } from '@rainbow-me/styles';
import rnColors from '@rainbow-me/styles/colors';
import ShadowStack from 'react-native-shadow-stack';

import { Centered } from '../layout';

const buildSmallShadows = color => [
  [0, 3, 5, rnColors.shadow, 0.14],
  [0, 6, 10, avatarColor[color] || color, 0.2],
];

const sizeConfigs = () => ({
  large: {
    dimensions: 65,
    shadow: [
      [0, 6, 10, rnColors.shadow, 0.12],
      [0, 2, 5, rnColors.shadow, 0.08],
    ],
    textSize: 'bigger',
  },
  medium: {
    dimensions: 40,
    shadow: [
      [0, 4, 6, rnColors.shadow, 0.04],
      [0, 1, 3, rnColors.shadow, 0.08],
    ],
    textSize: 'larger',
  },
  small: {
    dimensions: 34,
    textSize: 'large',
  },
});

const Avatar = styled(Image)`
  height: ${({ dimensions }) => dimensions};
  width: ${({ dimensions }) => dimensions};
`;

const ImageAvatar = ({ image, size = 'medium', ...props }) => {
  const { dimensions, shadow } = useMemo(() => sizeConfigs()[size], [size]);

  const shadows = useMemo(
    () => (size === 'small' ? buildSmallShadows(rnColors.shadow) : shadow),
    [shadow, size]
  );

  return (
    <ShadowStack
      {...props}
      {...borders.buildCircleAsObject(dimensions)}
      backgroundColor={colors.white}
      shadows={shadows}
    >
      <Centered flex={1}>
        <Avatar
          dimensions={dimensions}
          source={{
            uri: image,
          }}
        />
      </Centered>
    </ShadowStack>
  );
};

export default React.memo(ImageAvatar);
