import React, { useCallback } from 'react';

import { Touchable, Icon, Text, EmojiText, Container } from '../.';
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
      paddingVertical={5}
    >
      <Container flexDirection="row">
        {props.emojiName ? (
          <EmojiText name={`flag_${props.emojiName}`} paddingRight={3} />
        ) : null}
        <Text weight="bold" size="body">
          {label}
          {'   '}
          {props.default ? (
            <Text variant="subText" textTransform="uppercase">
              Default
            </Text>
          ) : null}
        </Text>
        <Container flex={1} alignItems="flex-end">
          {selected ? (
            <Icon
              name="check-circle"
              color="lightGreen"
              iconSize="medium"
              {...iconProps}
            />
          ) : (
            <Container
              width={22}
              height={22}
              borderRadius={11}
              borderColor="buttonSecondaryBorder"
              borderWidth={1}
            />
          )}
        </Container>
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
  default?: boolean;
  emojiName?: string;
  onPress?: ({ index, value }: { index: number; value: string }) => void;
}
