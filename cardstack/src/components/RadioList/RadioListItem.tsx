import React, { useCallback } from 'react';

import { Touchable, Icon, Text, Container } from '../.';
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
  const onPress = useCallback(() => {
    if (props.onPress && !disabled) {
      props.onPress({ value, index });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, props.onPress, disabled]);

  return (
    <Touchable
      onPress={onPress}
      disabled={disabled}
      width="100%"
      justifyContent="flex-start"
    >
      <Container flexDirection="row" paddingHorizontal={5} paddingVertical={4}>
        <Text weight="bold">{label}</Text>
        {selected ? (
          <Container flex={1} alignItems="flex-end">
            <Icon
              name="check"
              color="backgroundBlue"
              iconSize="medium"
              {...iconProps}
            />
          </Container>
        ) : null}
      </Container>
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
