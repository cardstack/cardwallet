import { endsWith } from 'lodash';
import React, { memo, useMemo } from 'react';

import { CenteredContainer } from '@cardstack/components';
import { CollectibleType } from '@cardstack/types';
import { screenWidth } from '@cardstack/utils';

import { CollectibleImage } from '@rainbow-me/components/collectible';

const minHeight = screenWidth * 0.9;

interface CollectibleImageWrapperProps {
  collectible: CollectibleType;
}

const CollectibleImageWrapper = ({
  collectible,
}: CollectibleImageWrapperProps) => {
  const imageUrl = useMemo(() => {
    const isSVG = endsWith(collectible.image_url, '.svg');
    return isSVG ? collectible.image_preview_url : collectible.image_url;
  }, [collectible]);

  return (
    <CenteredContainer
      marginHorizontal={4}
      flex={1}
      borderRadius={15}
      overflow="hidden"
      minHeight={minHeight}
    >
      <CollectibleImage
        backgroundColor={collectible.background}
        imageUrl={imageUrl}
        item={collectible}
        resizeMode={'contain' as any} // Casting to be used on js file
      />
    </CenteredContainer>
  );
};

export default memo(CollectibleImageWrapper);
