import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';
import { useAccountProfile } from '../../hooks';
import { ButtonPressAnimation } from '../animations';
import ImageAvatar from '../contacts/ImageAvatar';
import { Flex, InnerBorder } from '../layout';
import { Text } from '../text';
import { position } from '@rainbow-me/styles';

const AvatarCircleSize = 65;

const AvatarCircleContainer = styled(Flex)`
  ${position.sizeAsObject(AvatarCircleSize)};
  background-color: ${({ backgroundColor = '#FFFFFF' }) => backgroundColor};
  border-color: rgba(255, 255, 255, 0.4);
  border-radius: 100px;
  border-width: 1px;
  margin-bottom: 12px;
  overflow: hidden;
`;

const AvatarCircleView = styled.View`
  ${position.size(AvatarCircleSize)};
  margin-bottom: 16px;
  justify-content: ${ios ? 'flex-start' : 'center'};
  align-items: ${ios ? 'flex-start' : 'center'};
  justify-content: center;
  align-items: center;
`;

const FirstLetter = styled(Text).attrs(({ theme: { colors } }) => ({
  align: 'center',
  color: colors.whiteLabel,
  letterSpacing: 2,
  lineHeight: android ? 68 : 66,
  size: ios ? 38 : 30,
  weight: 'semibold',
}))``;

export default function AvatarCircle({ onPress, overlayStyles, image }) {
  const { colors } = useTheme();
  const { accountColor, accountSymbol } = useAccountProfile();

  return (
    <ButtonPressAnimation
      enableHapticFeedback
      marginTop={2}
      onPress={onPress}
      pressOutDuration={200}
      scaleTo={0.9}
    >
      <AvatarCircleContainer
        backgroundColor={colors.avatarColor[accountColor]}
        overlayStyles={overlayStyles}
        size={AvatarCircleSize}
      >
        {image ? (
          <ImageAvatar image={image} size="large" />
        ) : (
          <AvatarCircleView>
            <FirstLetter>{accountSymbol}</FirstLetter>
            {!overlayStyles && <InnerBorder opacity={0.02} radius={65} />}
          </AvatarCircleView>
        )}
      </AvatarCircleContainer>
    </ButtonPressAnimation>
  );
}
