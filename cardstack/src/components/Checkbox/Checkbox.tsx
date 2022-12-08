import React, { useCallback, useState, useEffect, ReactNode } from 'react';

import { Touchable, Container, Text, Icon } from '../.';
import { IconProps } from '../Icon';

type CheckboxPositionType = 'left' | 'right';
type VerticalAlignType = 'flex-start' | 'flex-end' | 'center';

interface CheckboxProps {
  onPress?: (checked: boolean) => void;
  label?: string;
  isDisabled?: boolean;
  iconProps?: IconProps;
  isSelected?: boolean;
  checkboxPosition?: CheckboxPositionType;
  verticalAlign?: VerticalAlignType;
  children?: ReactNode;
}

const CHECKBOX_SIZE = 22;

export const Checkbox = ({
  label,
  onPress,
  isSelected = false,
  checkboxPosition = 'right',
  verticalAlign = 'center',
  children,
}: CheckboxProps) => {
  const [selected, setSelected] = useState(isSelected);

  const handleCall = useCallback(() => {
    const toggledCheck = !selected;

    if (onPress) {
      onPress(toggledCheck);
    }

    setSelected(toggledCheck);
  }, [onPress, selected]);

  useEffect(() => {
    setSelected(isSelected);
  }, [isSelected]);

  const flexDirection = checkboxPosition === 'left' ? 'row' : 'row-reverse';

  return (
    <Touchable
      flexDirection={flexDirection}
      alignItems={verticalAlign}
      onPress={handleCall}
    >
      <Container
        alignItems="center"
        backgroundColor={selected ? 'checkboxSelected' : 'checkboxDeselected'}
        borderColor="black"
        borderRadius={5}
        borderWidth={1}
        height={CHECKBOX_SIZE}
        justifyContent="center"
        width={CHECKBOX_SIZE}
      >
        {selected && <Icon color="black" iconSize="small" name="check" />}
      </Container>
      <Container padding={2} />
      {label && <Text>{label}</Text>}
      {children}
    </Touchable>
  );
};
