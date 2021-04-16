import React, { useCallback } from 'react';

import { Touchable, Icon, Text } from '../.';
import { IconProps } from '../Icon';

export const RadioListItem = ({
  label,
  selected,
  index,
  disabled,
  value,
  iconProps,
  ...props
}: RadioListItemProps) => {
  console.log(
    '----------render item props---------------',
    index,
    label,
    selected
  );

  const onPress = useCallback(() => {
    console.log('value', index);

    if (props.onPress && !disabled) {
      props.onPress({ value, index });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, props.onPress, disabled]);

  return (
    <Touchable
      flexDirection="row-reverse"
      onPress={onPress}
      disabled={disabled}
    >
      <Text>{label}</Text>
      {selected ? (
        <Icon name="check" color="backgroundBlue" {...iconProps} />
      ) : null}
    </Touchable>
  );
};

export interface RadioListItemProps {
  iconProps?: IconProps;
  label: string;
  key: number;
  index: number;
  value: string;
  disabled: boolean;
  selected: boolean;
  onPress: ({ index, value }: { index: number; value: string }) => void;
}
