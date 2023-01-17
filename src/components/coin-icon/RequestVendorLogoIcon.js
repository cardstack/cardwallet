import React, { useMemo, useState } from 'react';
import styled from 'styled-components';

import { Container } from '@cardstack/components';

import { ImgixImage } from '@rainbow-me/images';
import { position } from '@rainbow-me/styles';
import colors, { getFallbackTextColor } from '@rainbow-me/styles/colors';

import { initials } from '../../utils';
import { Centered } from '../layout';
import { Text } from '../text';

import { CoinIconSize } from './CoinIcon';

const RVLIBorderRadius = 16.25;

const Content = styled(Centered)`
  ${({ size }) => position.size(size)};
  background-color: ${({ color }) => color};
`;

export default function RequestVendorLogoIcon({
  backgroundColor,
  borderRadius = RVLIBorderRadius,
  dappName,
  imageUrl,
  shouldPrioritizeImageLoading,
  size = CoinIconSize,
  ...props
}) {
  const [error, setError] = useState(null);

  // When dapps have no icon the bgColor provided to us is transparent.
  // Having a transparent background breaks our UI, so we instead show a background
  // color of white.
  const bgColor =
    backgroundColor === 'transparent'
      ? colors.white
      : backgroundColor || colors.dark;

  const imageSource = useMemo(
    () => ({
      priority:
        ImgixImage.priority[shouldPrioritizeImageLoading ? 'high' : 'low'],
      uri: imageUrl,
    }),
    [imageUrl, shouldPrioritizeImageLoading]
  );

  return (
    <Container backgroundColor="white" borderRadius={borderRadius} {...props}>
      <Content color={bgColor} size={size}>
        {imageUrl && !error ? (
          <ImgixImage
            onError={setError}
            source={imageSource}
            style={position.sizeAsObject('100%')}
          />
        ) : (
          <Text
            align="center"
            color={getFallbackTextColor(bgColor)}
            size="smedium"
            weight="semibold"
          >
            {initials(dappName)}
          </Text>
        )}
      </Content>
    </Container>
  );
}
