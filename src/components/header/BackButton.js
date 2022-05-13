import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import Text from '../text/Text';
import HeaderButton from './HeaderButton';
import { Container, Icon } from '@cardstack/components';
import { colors } from '@cardstack/theme';
import { fonts, fontWithWidth } from '@rainbow-me/styles';

const IconText = styled(Text).attrs(({ theme: { colors } }) => ({
  color: colors.dark,
  size: 'big',
}))`
  ${fontWithWidth(fonts.weight.bold)};
`;

export default function BackButton({
  direction = 'left',
  onPress,
  throttle,
  testID,
  textChevron,
  color,
  ...props
}) {
  const navigation = useNavigation();

  const handlePress = useCallback(
    event => {
      if (onPress) {
        return onPress(event);
      }

      return navigation.goBack();
    },
    [navigation, onPress]
  );

  return (
    <HeaderButton
      onPress={handlePress}
      opacityTouchable={false}
      radiusAndroid={42}
      radiusWrapperStyle={{
        alignItems: 'center',
        height: 42,
        justifyContent: 'center',
        marginRight: 5,
        width: 42,
        ...(textChevron && { left: 6 }),
      }}
      testID={testID + '-back-button'}
      throttle={throttle}
      transformOrigin={direction}
    >
      <Container {...props} justifyContent="center" textChevron={textChevron}>
        {textChevron ? (
          <IconText color={colors.white}>←</IconText>
        ) : (
          <Icon
            alignSelf="center"
            color={color || 'white'}
            iconSize="xl"
            name={`chevron-${direction}`}
          />
        )}
      </Container>
    </HeaderButton>
  );
}
