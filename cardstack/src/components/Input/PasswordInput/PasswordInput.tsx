import React, { memo } from 'react';

import {
  Container,
  Icon,
  Input,
  InputProps,
  Text,
  Touchable,
} from '@cardstack/components';
import { palette } from '@cardstack/theme';
import { hitSlop } from '@cardstack/utils';

import { usePasswordInput } from './usePasswordInput';

const baseInputProps: InputProps = {
  paddingHorizontal: 5,
  paddingVertical: 3,
  color: 'white',
  selectionColor: 'teal',
};

const PasswordInput = () => {
  const {
    togglePasswordVisibility,
    iconName,
    isPasswordVisible,
  } = usePasswordInput();

  return (
    <Container width="100%">
      <Container
        backgroundColor="black"
        borderRadius={6}
        flexDirection="row"
        alignContent="center"
        justifyContent="space-between"
        marginBottom={2}
      >
        <Container flex={1}>
          <Input
            placeholder="Enter password"
            placeholderTextColor={palette.blueText}
            secureTextEntry={!isPasswordVisible}
            autoCapitalize="none"
            {...baseInputProps}
          />
        </Container>
        <Touchable
          onPress={togglePasswordVisibility}
          flex={0.15}
          hitSlop={hitSlop.small}
          alignItems="center"
          justifyContent="center"
        >
          <Icon name={iconName} color="teal" iconSize="small" />
        </Touchable>
      </Container>
      <Container flexDirection="row" alignItems="center">
        <Icon name="check" color="lightGreen" size={14} />
        <Text fontSize={12} color="white" paddingLeft={1}>
          At least 8 characters, with at least 1 number
        </Text>
      </Container>
    </Container>
  );
};

export default memo(PasswordInput);
