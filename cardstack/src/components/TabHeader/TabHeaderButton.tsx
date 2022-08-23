import React from 'react';

import { Container, Touchable, Text } from '@cardstack/components';
import { ColorTypes } from '@cardstack/theme';

export interface TabHeaderProps {
  title: string;
  isSelected?: boolean;
  onPress: () => void;
  color?: ColorTypes;
}

export const TabHeaderButton = ({
  title,
  isSelected = false,
  onPress,
  color = 'black',
}: TabHeaderProps) => {
  return (
    <Touchable
      alignItems="center"
      justifyContent="center"
      onPress={onPress}
      paddingTop={5}
      flex={1}
    >
      <Text
        color={color}
        marginBottom={3}
        opacity={isSelected ? 1 : 0.5}
        weight={isSelected ? 'bold' : 'regular'}
      >
        {title}
      </Text>
      <Container
        backgroundColor={isSelected ? 'buttonPrimaryBorder' : undefined}
        height={3}
        width="100%"
      />
    </Touchable>
  );
};
