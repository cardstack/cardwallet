import React from 'react';
import Animated, { EasingNode } from 'react-native-reanimated';
import { toRad, useTimingTransition } from 'react-native-redash/lib/module/v1';
import styled from 'styled-components';

import { AnimatedPressable } from '@cardstack/components';

import { ImgixImage } from '@rainbow-me/images';
import { padding } from '@rainbow-me/styles';
import colors from '@rainbow-me/styles/colors';

import CaretImageSource from '../../assets/family-dropdown-arrow.png';
import { interpolate } from '../animations';
import { Row, RowWithMargins } from '../layout';
import { Text, TruncatedText } from '../text';

import TokenFamilyHeaderIcon from './TokenFamilyHeaderIcon';

const AnimatedImgixImage = Animated.createAnimatedComponent(ImgixImage);

export const TokenFamilyHeaderAnimationDuration = 200;
export const TokenFamilyHeaderHeight = 50;

const Content = styled(Row).attrs({
  align: 'center',
  justify: 'space-between',
})`
  ${({ isCoinRow }) => padding(0, isCoinRow ? 16 : 19)};
  background-color: ${colors.white};
  height: ${TokenFamilyHeaderHeight};
  width: 100%;
`;

const ChildrenAmountText = styled(Text).attrs({
  align: 'right',
  letterSpacing: 'roundedTight',
  size: 'large',
})`
  margin-bottom: 1;
`;

const RotatingArrowIcon = styled(AnimatedImgixImage).attrs(() => ({
  resizeMode: ImgixImage.resizeMode.contain,
  source: CaretImageSource,
  tintColor: colors.dark,
}))`
  height: 18;
  margin-bottom: 1;
  right: 5;
  width: 8;
`;

const TitleText = styled(TruncatedText).attrs({
  align: 'left',
  letterSpacing: 'roundedMedium',
  lineHeight: 'normal',
  size: 'large',
  weight: 'bold',
})`
  flex: 1;
  margin-bottom: 1;
  padding-left: 9;
  padding-right: 9;
`;

const TokenFamilyHeader = ({
  childrenAmount,
  familyImage,
  isCoinRow,
  isOpen,
  onPress,
  title,
}) => {
  const animation = useTimingTransition(!isOpen, {
    duration: TokenFamilyHeaderAnimationDuration,
    easing: EasingNode.bezier(0.25, 0.1, 0.25, 1),
  });

  const rotate = toRad(
    interpolate(animation, {
      inputRange: [0, 1],
      outputRange: [90, 0],
    })
  );

  return (
    <AnimatedPressable onPress={onPress}>
      <Content isCoinRow={isCoinRow}>
        <RowWithMargins align="center" margin={9}>
          <TokenFamilyHeaderIcon
            familyImage={familyImage}
            familyName={title}
            isCoinRow={isCoinRow}
          />
        </RowWithMargins>
        <TitleText>{title}</TitleText>
        <RowWithMargins align="center" margin={13}>
          <Animated.View style={{ opacity: animation }}>
            <ChildrenAmountText>{childrenAmount}</ChildrenAmountText>
          </Animated.View>
          <RotatingArrowIcon style={{ transform: [{ rotate }] }} />
        </RowWithMargins>
      </Content>
    </AnimatedPressable>
  );
};

export default React.memo(TokenFamilyHeader);
