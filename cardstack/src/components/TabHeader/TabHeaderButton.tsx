import React from 'react';
import { Container, Touchable, Text } from '@cardstack/components';

export interface TabHeaderProps {
  title: string;
  isSelected?: boolean;
  onPress: () => void;
}

export const TabHeaderButton = ({
  title,
  isSelected = false,
  onPress,
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
        color="black"
        marginBottom={3}
        opacity={isSelected ? 1 : 0.5}
        weight={isSelected ? 'bold' : 'regular'}
      >
        {title}
      </Text>
      <Container
        backgroundColor={isSelected ? 'buttonPrimaryBorder' : 'white'}
        height={3}
        width="100%"
      />
    </Touchable>
  );
};
