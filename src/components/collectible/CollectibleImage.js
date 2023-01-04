import React, { memo, useCallback, useState } from 'react';
import { buildCollectibleName } from '../../helpers/assets';
import { Centered } from '../layout';
import { Monospace } from '../text';
import { ImageWithCachedMetadata, ImgixImage } from '@rainbow-me/images';
import { position } from '@rainbow-me/styles';
import colors from '@rainbow-me/styles/colors';

const getFallbackTextColor = bg =>
  colors.getTextColorForBackground(bg, {
    dark: colors.alpha(colors.blueGreyDark, 0.5),
    light: colors.white,
  });

const CollectibleImage = ({
  backgroundColor = 'white',
  imageUrl,
  item,
  resizeMode = ImgixImage.resizeMode.cover,
}) => {
  const [error, setError] = useState(null);
  const handleError = useCallback(error => setError(error), [setError]);

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
