import React, { useMemo } from 'react';
import { FallbackIcon } from 'react-coin-icon';
import { Image } from 'react-native';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';
import { Centered } from '../layout';
import { useBooleanState } from '@cardstack/hooks';
import { colors } from '@cardstack/theme';
import { Device } from '@cardstack/utils';
import { borders, fonts, position, shadow } from '@rainbow-me/styles';
import { getUrlForTrustIconFallback, magicMemo } from '@rainbow-me/utils';

const fallbackTextStyles = {
  fontFamily: fonts.family.SFProRounded,
  fontWeight: fonts.weight.bold,
  letterSpacing: fonts.letterSpacing.roundedTight,
  marginBottom: 0.5,
  textAlign: 'center',
};

const FallbackImage = styled(Image)`
  ${position.cover};
  ${({
    shadowColor: color,
    shadowOffset: { height: y, width: x },
    shadowOpacity: opacity,
    shadowRadius: radius,
    showImage,
  }) => shadow.build(x, y, radius * 2, color, showImage ? opacity : 0)};
  background-color: ${({ showImage }) =>
    showImage ? colors.white : colors.transparent};
  border-radius: ${({ size }) => size / 2};
  overflow: visible;
`;

function WrappedFallbackImage({
  color,
  elevation = 6,
  shadowOpacity,
  showImage,
  size,
  ...props
}) {
  const { colors } = useTheme();
  return (
    <Centered
      {...props}
      {...position.coverAsObject}
      {...borders.buildCircleAsObject(size)}
      backgroundColor={colors.alpha(color || colors.dark, shadowOpacity || 0.3)}
      elevation={showImage ? elevation : 0}
      opacity={showImage ? 1 : 0}
    >
      <FallbackImage
        {...props}
        overlayColor={color || colors.dark}
        shadowOpacity={shadowOpacity}
        showImage={showImage}
        size={size}
      />
    </Centered>
  );
}

const FallbackImageElement = Device.isAndroid
  ? WrappedFallbackImage
  : FallbackImage;

const CoinIconFallback = fallbackProps => {
  const { address = '', height, symbol, width } = fallbackProps;

  const [showImage, showFallbackImage, hideFallbackImage] = useBooleanState(
    false
  );

  const fallbackIconColor = colors.white;
  const imageUrl = useMemo(() => getUrlForTrustIconFallback(address), [
    address,
  ]);

  return (
    <Centered height={height} width={width}>
      {!showImage && (
        <FallbackIcon
          {...fallbackProps}
          color={fallbackIconColor}
          showImage={showImage}
          symbol={symbol || ''}
          textStyles={fallbackTextStyles}
        />
      )}
      <FallbackImageElement
        {...fallbackProps}
        color={fallbackIconColor}
        imageUrl={imageUrl}
        onError={hideFallbackImage}
        onLoad={showFallbackImage}
        showImage={showImage}
        size={width}
      />
    </Centered>
  );
};

export default magicMemo(CoinIconFallback, ['address', 'style', 'symbol']);
