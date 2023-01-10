import React, { useMemo } from 'react';
import { FallbackIcon } from 'react-coin-icon';

import { Device } from '@cardstack/utils';

import { ImageWithCachedMetadata } from '@rainbow-me/images';
import { borders } from '@rainbow-me/styles';
import colors from '@rainbow-me/styles/colors';
import ShadowStack from 'react-native-shadow-stack';

import { initials } from '../../utils';

const shadowsFactory = () => [
  [0, 4, Device.isAndroid ? 1 : 6, colors.shadow, 0.04],
  [0, 1, 3, colors.shadow, 0.08],
];

const TokenFamilyHeaderIcon = ({
  familyImage,
  familyName,
  isCoinRow,
  style,
}) => {
  const circleStyle = useMemo(
    () => borders.buildCircleAsObject(isCoinRow ? 40 : 32),
    [isCoinRow]
  );

  const shadows = useMemo(() => shadowsFactory(), []);

  return (
    <ShadowStack
      {...circleStyle}
      backgroundColor={colors.white}
      shadows={shadows}
      style={style}
    >
      {familyImage ? (
        <ImageWithCachedMetadata imageUrl={familyImage} style={circleStyle} />
      ) : (
        <FallbackIcon {...circleStyle} symbol={initials(familyName)} />
      )}
    </ShadowStack>
  );
};

export default React.memo(TokenFamilyHeaderIcon);
