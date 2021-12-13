import { endsWith } from 'lodash';
import React, { memo } from 'react';
import styled from 'styled-components';
import { useDimensions, useImageMetadata } from '../../../hooks';
import { CollectibleImage } from '../../collectible';
import { Centered } from '../../layout';
import { Container } from '@cardstack/components';
import { CollectibleType } from '@cardstack/types';
import { margin, position } from '@rainbow-me/styles';

const paddingHorizontal = 19;

interface ImageWrapperProps {
  isImageHuge?: boolean;
}

const ImageWrapper = styled(Centered)`
  ${(props: ImageWrapperProps) =>
    margin(props.isImageHuge ? paddingHorizontal : 0, 0)};
  ${position.size('100%')};
  border-radius: 10;
  overflow: hidden;
`;

interface CollectibleExpandedStateImageProps {
  collectible: CollectibleType;
}

const CollectibleExpandedStateImage = ({
  collectible,
}: CollectibleExpandedStateImageProps) => {
  const { width: deviceWidth } = useDimensions();

  const isSVG = endsWith(collectible.image_url, '.svg');
  const imageUrl = isSVG
    ? collectible.image_preview_url
    : collectible.image_url;

  const { dimensions: imageDimensions } = useImageMetadata(imageUrl);

  const maxImageWidth = deviceWidth - paddingHorizontal * 2;
  const maxImageHeight = maxImageWidth * 1.5;

  const heightForDeviceSize =
    (maxImageWidth * imageDimensions.height) / imageDimensions.width;

  const containerHeight =
    heightForDeviceSize > maxImageHeight ? maxImageWidth : heightForDeviceSize;

  return (
    <Container
      alignItems="center"
      borderRadius={20}
      height={containerHeight}
      justifyContent="center"
      marginVertical={4}
      style={{ paddingHorizontal }}
    >
      <ImageWrapper isImageHuge={heightForDeviceSize > maxImageHeight}>
        <CollectibleImage
          backgroundColor={collectible.background}
          imageUrl={imageUrl}
          item={collectible}
          resizeMode="contain"
        />
      </ImageWrapper>
    </Container>
  );
};

export default memo(CollectibleExpandedStateImage);
