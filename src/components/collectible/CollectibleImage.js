import React, { memo, useCallback, useState } from 'react';

import { ImageWithCachedMetadata, ImgixImage } from '@rainbow-me/images';
import { position } from '@rainbow-me/styles';
import { getFallbackTextColor } from '@rainbow-me/styles/colors';

import { buildCollectibleName } from '../../helpers/assets';
import { Centered } from '../layout';
import { Monospace } from '../text';

const CollectibleImage = ({
  backgroundColor = 'white',
  imageUrl,
  item,
  resizeMode = ImgixImage.resizeMode.cover,
}) => {
  const [error, setError] = useState(null);
  const handleError = useCallback(e => setError(e), [setError]);

  return (
    <Centered backgroundColor={backgroundColor} style={position.coverAsObject}>
      {imageUrl && !error ? (
        <ImageWithCachedMetadata
          imageUrl={imageUrl}
          onError={handleError}
          resizeMode={ImgixImage.resizeMode[resizeMode]}
          style={position.coverAsObject}
        />
      ) : (
        <Monospace
          align="center"
          color={getFallbackTextColor(backgroundColor)}
          lineHeight="looser"
          size="smedium"
        >
          {buildCollectibleName(item)}
        </Monospace>
      )}
    </Centered>
  );
};

export default memo(CollectibleImage);
