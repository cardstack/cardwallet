import React from 'react';

import { Touchable, Icon, Text } from '../.';
import { IconProps } from '../Icon';

export const RadioListItem = ({
  label,
  disabled,
  selected,
  onPress,
}: RadioListItemProps) => {
  return (
    <Touchable
      flexDirection="row-reverse"
      onPress={onPress}
      disabled={disabled}
    >
      <Text>{label}</Text>
      {selected ? <Icon name="check" /> : null}
    </Touchable>
  );
};

export interface RadioListItemProps {
  iconProps: IconProps;
  label: string;
  disabled: boolean;
  selected: boolean;
  onPress: () => void;
}
