import React, { useState, useMemo, useCallback } from 'react';
import { StyleSheet } from 'react-native';

import {
  Container,
  ContainerProps,
  Text,
  Touchable,
} from '@cardstack/components';

export interface SwitchSelectorOption {
  label: string;
  value: number;
}

interface SwitchSelectorProps {
  options: SwitchSelectorOption[];
  initial?: number;
  onPress?: (value: SwitchSelectorOption) => void;
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 1 },
});

export const SwitchSelector = ({
  initial = 0,
  options = [],
  borderRadius = 50,
  height = 35,
  onPress,
  ...otherProps
}: SwitchSelectorProps & ContainerProps) => {
  const [selected, setSelected] = useState<number>(initial);

  const buttonStyle = useMemo(() => {
    const isLeftEnabled = selected === 0;
    const LeftOrRight = isLeftEnabled ? 'Left' : 'Right';

    return {
      [`borderTop${LeftOrRight}Radius`]: borderRadius,
      [`borderBottom${LeftOrRight}Radius`]: borderRadius,
    };
  }, [borderRadius, selected]);

  const toggleItem = useCallback(
    (index: number) => () => {
      setSelected(index);
      onPress?.(options[index]);
    },
    [onPress, options]
  );

  const renderOptions = useMemo(
    () =>
      options.map((option, index) => {
        const isSelected = selected === index;

        return (
          <Touchable
            key={index}
            flex={1}
            justifyContent="center"
            onPress={toggleItem(index)}
            style={buttonStyle}
            height="95%"
            backgroundColor={isSelected ? 'teal' : 'transparent'}
          >
            <Text
              fontWeight="600"
              fontSize={13}
              textAlign="center"
              color={isSelected ? 'black' : 'white'}
            >
              {option.label}
            </Text>
          </Touchable>
        );
      }),
    [buttonStyle, options, selected, toggleItem]
  );

  return (
    <Container
      height={height}
      borderWidth={1.5}
      flexDirection="row"
      borderColor="whiteLightOpacity"
      backgroundColor="darkGrayOpacity"
      alignItems="center"
      borderRadius={borderRadius}
      style={styles.container}
      {...otherProps}
    >
      {renderOptions}
    </Container>
  );
};
