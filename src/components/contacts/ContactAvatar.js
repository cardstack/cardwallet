import { toUpper } from 'lodash';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';
import { getFirstGrapheme } from '../../utils';
import { Centered } from '../layout';
import { Text } from '../text';
import { borders } from '@rainbow-me/styles';

const sizeConfigs = () => ({
  large: {
    dimensions: 65,
    textSize: 'bigger',
  },
  medium: {
    dimensions: 40,
    textSize: 'larger',
  },
  small: {
    dimensions: 34,
    textSize: 'large',
  },
  smaller: {
    dimensions: 20,
    textSize: 'smaller',
  },
  smedium: {
    dimensions: 36,
    textSize: 'large',
  },
});

const ContactAvatarContainer = styled.View`
  background-color: ${({ backgroundColor = 'transparent' }) => backgroundColor};
  border-color: rgba(255, 255, 255, 0.4);
  border-radius: 100px;
  border-width: 1px;
  overflow: hidden;
`;

const ContactAvatar = ({
  color,
  size = 'medium',
  value,
  textColor = null,
  ...props
}) => {
  const { colors } = useTheme();
  const { dimensions, textSize } = useMemo(() => sizeConfigs(colors)[size], [
    colors,
    size,
  ]);

  return (
    <ContactAvatarContainer
      {...props}
      {...borders.buildCircleAsObject(dimensions)}
      backgroundColor={colors.avatarColor[color] || color}
    >
      <Centered flex={1}>
        <Text
          align="center"
          color={textColor ? textColor : colors.whiteLabel}
          letterSpacing="zero"
          size={textSize}
          weight="bold"
        >
          {value && getFirstGrapheme(toUpper(value))}
        </Text>
      </Centered>
    </ContactAvatarContainer>
  );
};

export default React.memo(ContactAvatar);
