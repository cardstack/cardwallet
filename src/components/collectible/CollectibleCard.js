import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import { magicMemo } from '../../utils';
import { ButtonPressAnimation } from '../animations';
import { InnerBorder } from '../layout';
import CollectibleImage from './CollectibleImage';
import { shadow as shadowUtil } from '@rainbow-me/styles';

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
  scaleTo = 0.96,
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

  const { colors } = useTheme();

  const defaultShadow = useMemo(() => CollectibleCardShadowFactory(colors), [
    colors,
  ]);

  return (
    <Container
      as={ButtonPressAnimation}
      disabled={disabled}
      enableHapticFeedback={enableHapticFeedback}
      onPress={handlePress}
      scaleTo={scaleTo}
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

export default magicMemo(CollectibleCard, [
  'height',
  'item.id',
  'style',
  'width',
]);
