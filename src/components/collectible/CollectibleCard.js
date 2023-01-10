import React, { memo, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import styled from 'styled-components';

import { AnimatedPressable } from '@cardstack/components';

import { shadow as shadowUtil } from '@rainbow-me/styles';
import colors from '@rainbow-me/styles/colors';

import { InnerBorder } from '../layout';

import CollectibleImage from './CollectibleImage';

const CollectibleCardBorderRadius = 20;
const CollectibleCardShadowFactory = colors => [0, 2, 6, colors.shadow, 0.08];

const Container = styled(View)`
  ${({ shadow }) => shadowUtil.build(...shadow)};
`;

const Content = styled(View)`
  border-radius: ${CollectibleCardBorderRadius};
  height: ${({ height }) => height};
  overflow: hidden;
  width: ${({ width }) => width};
`;

const CollectibleCard = ({
  borderEnabled = true,
  disabled,
  enableHapticFeedback = true,
  height,
  item: { background, image_preview_url, ...item },
  onPress,
  resizeMode,
  shadow,
  style,
  width,
  ...props
}) => {
  const handlePress = useCallback(() => {
    if (onPress) {
      onPress(item);
    }
  }, [item, onPress]);

  const defaultShadow = useMemo(() => CollectibleCardShadowFactory(colors), []);

  return (
    <Container
      as={AnimatedPressable}
      disabled={disabled}
      enableHapticFeedback={enableHapticFeedback}
      onPress={handlePress}
      shadow={shadow || defaultShadow}
    >
      <Content {...props} height={height} style={style} width={width}>
        <CollectibleImage
          backgroundColor={background || colors.lightestGrey}
          imageUrl={image_preview_url}
          item={item}
          resizeMode={resizeMode}
        />
        {borderEnabled && (
          <InnerBorder
            opacity={0.04}
            radius={CollectibleCardBorderRadius}
            width={0.5}
          />
        )}
      </Content>
    </Container>
  );
};

export default memo(CollectibleCard);
