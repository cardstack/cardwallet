import React, { useCallback, useState } from 'react';
import { Touchable, Container, Text, Icon } from '../.';
import { ContainerProps } from '../Container';
import { IconProps } from '../Icon';

interface CheckboxProps extends ContainerProps {
  onPress?: () => void;
  label: string;
  isDisabled?: boolean;
  iconProps?: IconProps;
  isSelected?: boolean;
}

export const Checkbox = ({
  label,
  onPress,
  isDisabled,
  isSelected = false,
}: CheckboxProps) => {
  const [selected, setSelected] = useState(isSelected);
  const [disabled] = useState(isDisabled);

  const handleCall = useCallback(() => {
    setSelected(!selected);

    if (onPress) {
      onPress();
    }
  }, [onPress, selected]);

  return (
    <Container flexDirection="row">
      <Container flexDirection="row">
        {label && <Text>{label}</Text>}
        <Touchable marginLeft={5} onPress={handleCall} disabled={disabled}>
          <Container
            alignItems="center"
            backgroundColor={
              disabled ? 'underlineGray' : 'buttonPrimaryBackground'
            }
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
        </Touchable>
      </Container>
    </Container>
  );
};
