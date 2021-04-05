import React from 'react';
import { Box, Touchable } from '../index';

export const BackDrop = ({
  zIndex = 0,
  onPress = undefined,
}: BackDropProps) => {
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
      <Box
        alignItems="center"
        justifyContent="center"
        backgroundColor="transparent"
      />
    </Touchable>
  );
};

interface BackDropProps {
  /** hideHandle */
  onPress?: () => void;
  /** zIndex */
  zIndex?: number;
}
