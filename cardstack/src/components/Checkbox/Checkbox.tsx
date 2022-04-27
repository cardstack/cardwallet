import React, { useCallback, useState, useEffect, ReactNode } from 'react';

import { Touchable, Container, ContainerProps, Text, Icon } from '../.';
import { IconProps } from '../Icon';

type CheckboxPositionType = 'left' | 'right';

interface CheckboxProps extends ContainerProps {
  onPress?: () => void;
  label?: string;
  isDisabled?: boolean;
  iconProps?: IconProps;
  isSelected?: boolean;
  checkboxPosition?: CheckboxPositionType;
  children?: ReactNode;
}

export const Checkbox = ({
  label,
  onPress,
  isDisabled,
  isSelected = false,
  checkboxPosition = 'right',
  children,
  ...rest
}: CheckboxProps) => {
  const [selected, setSelected] = useState(isSelected);
  const [disabled] = useState(isDisabled);

  const handleCall = useCallback(() => {
    setSelected(!selected);

    if (onPress) {
      onPress();
    }
  }, [onPress, selected]);

  useEffect(() => {
    setSelected(isSelected);
  }, [isSelected]);

  const flexDirection = checkboxPosition === 'left' ? 'row' : 'row-reverse';

  return (
    <Touchable
      flexDirection={flexDirection}
      alignItems="center"
      onPress={handleCall}
      disabled={disabled}
      {...rest}
    >
      <Container
        alignItems="center"
        backgroundColor={disabled ? 'underlineGray' : 'buttonPrimaryBackground'}
        borderColor={disabled ? 'transparent' : 'black'}
        borderRadius={5}
        borderWidth={1}
        height={22}
        justifyContent="center"
        width={22}
      >
        {selected && (
          <Icon
            color={disabled ? 'settingsGrayDark' : 'black'}
            iconSize="small"
            name="check"
          />
        )}
      </Container>
      <Container padding={2} />
      {label && <Text>{label}</Text>}
      {children}
    </Touchable>
  );
};
