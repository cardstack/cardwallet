import React from 'react';
import FastImage from 'react-native-fast-image';

import { ColorTypes } from '@cardstack/theme';

import { Container, Text } from '../.';

/**
 * A Avatar component, used for something.
 */
export const Avatar = ({
  source,
  textValue = 'Hello',
  backgroundColor = 'black',
  textColor = 'white',
  size = 50,
}: AvatarProps) => {
  const initials = [textValue].map(n => n[0].toUpperCase()).join('');

  return source ? (
    <FastImage
      style={{ width: size, height: size, borderRadius: size / 2 }}
      source={{
        uri: source,
        priority: FastImage.priority.normal,
      }}
      resizeMode={FastImage.resizeMode.contain}
    />
  ) : (
    <Container
      style={{
        backgroundColor,
        borderRadius: size / 2,
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text color={textColor}>{initials}</Text>
    </Container>
  );
};

export interface AvatarProps {
  /** textValue */
  textValue?: string;
  /** uri */
  source?: string | null;
  /** textColor */
  textColor?: ColorTypes;
  /** backgroundColor */
  backgroundColor?: string;
  size?: number;
}
