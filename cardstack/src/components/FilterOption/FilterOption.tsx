import React from 'react';

import { Touchable, Text } from '@cardstack/components';

import { ContainerProps } from '../Container';

interface FilterOptionProps {
  isSelected?: boolean;
  onPress?: () => void;
  text: string;
}

export const FilterOption = ({
  onPress,
  text,
  isSelected,
}: FilterOptionProps) => {
  const selectedProps: ContainerProps = isSelected
    ? {
        backgroundColor: 'black',
      }
    : {};

  return (
    <Touchable
      onPress={onPress}
      alignItems="center"
      justifyContent="center"
      borderRadius={100}
      width={40}
      height={40}
      {...selectedProps}
    >
      <Text
        size="small"
        weight="extraBold"
        color={isSelected ? 'white' : 'black'}
      >
        {text}
      </Text>
    </Touchable>
  );
};
