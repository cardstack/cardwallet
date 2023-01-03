import { toUpper } from 'lodash';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import { getFirstGrapheme } from '../../utils';
import { Centered } from '../layout';
import { Text } from '../text';
import { borders } from '@rainbow-me/styles';
import colors from '@rainbow-me/styles/colors';

const sizeConfigs = {
  xxlarge: {
    dimensions: 100,
    textSize: 'biggest',
  },
  xlarge: {
    dimensions: 80,
    textSize: 'biggest',
  },
  hlarge: {
    dimensions: 80,
    textSize: 'larger',
  },
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
};

const ContactAvatarContainer = styled(View)`
  background-color: ${({ backgroundColor = 'transparent' }) => backgroundColor};
  border-color: rgba(255, 255, 255, 0.4);
  border-radius: 100px;
  border-width: 1px;
  overflow: hidden;
`;

const ContactAvatar = ({ color, size = 'medium', value, ...props }) => {
  const { dimensions, textSize } = useMemo(() => sizeConfigs[size], [size]);

  return (
    <ContactAvatarContainer
      {...props}
      {...borders.buildCircleAsObject(dimensions)}
      backgroundColor={colors.avatarColor[color] || color}
    >
      <Centered flex={1}>
        <Text
          align="center"
          color={props.textColor || colors.whiteLabel}
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
