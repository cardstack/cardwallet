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
      paddingHorizontal={5}
      paddingVertical={6}
    >
      <Container flexDirection="row">
        <Text weight="bold">
          {label}
          {'   '}
          {props.default && (
            <Text variant="subText" textTransform="uppercase">
              Default
            </Text>
          )}
        </Text>
        {selected ? (
          <Container flex={1} alignItems="flex-end">
            <Icon
              name="check-circle"
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
  default: boolean;
  onPress: ({ index, value }: { index: number; value: string }) => void;
}
