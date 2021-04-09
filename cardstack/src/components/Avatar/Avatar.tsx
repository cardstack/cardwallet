import React, { ReactNode } from 'react';
import { Image } from 'react-native';
import FastImage, { FastImageProps, Source } from 'react-native-fast-image';
import { Container, Text } from '../.';
import theme from '@cardstack/theme';

/**
 * A Avatar component, used for something.
 */
export const Avatar = ({
  source,
  value,
  backgroundColor = 'black',
  textColor = 'white',
}: AvatarProps) => {
  const size = 50;

  const initials = [value].map(n => (n || '')[0].toUpperCase()).join('');

  return source ? (
    <Image
      source={{ uri: source }}
      style={{ width: size, height: size, borderRadius: size / 2 }}
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
  value?: string | null;
  /** uri */
  source?: string | null;
  textColor: string;
  backgroundColor: string;
}
