import React from 'react';
import { Touchable, Container } from '../.';

export const TouchableBackDrop = ({
  zIndex = 0,
  onPress = undefined,
}: TouchableBackDropProps) => {
  return (
    <Touchable
      activeOpacity={1}
      onPress={onPress}
      zIndex={zIndex}
      position="absolute"
      left={0}
      right={0}
      top={0}
      bottom={0}
    >
      <Container
        alignItems="center"
        justifyContent="center"
        backgroundColor="transparent"
      />
    </Touchable>
  );
};

interface TouchableBackDropProps {
  /** hideHandle */
  onPress?: () => void;
  /** zIndex */
  zIndex?: number;
}
