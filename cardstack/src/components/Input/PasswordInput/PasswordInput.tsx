import React, { memo, useMemo } from 'react';

import {
  BaseInputProps,
  Container,
  ContainerProps,
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

interface Props extends BaseInputProps {
  validation: {
    rule: (value: string) => boolean;
    message: string;
  };
  containerProps?: ContainerProps;
}

const PasswordInput = ({
  validation,
  containerProps,
  ...inputProps
}: Props) => {
  const {
    togglePasswordVisibility,
    iconName,
    isPasswordVisible,
    onChangeText,
    password,
  } = usePasswordInput();

  const { rule, message } = validation;

  const isValid = useMemo(() => rule(password), [password, rule]);

  return (
    <Container width="100%" {...containerProps}>
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
            onChangeText={onChangeText}
            value={password}
            {...baseInputProps}
            {...inputProps}
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
        {isValid && <Icon name="check" color="lightGreen" size={14} />}
        <Text
          fontSize={12}
          color={isValid ? 'white' : 'blueText'}
          paddingLeft={1}
        >
          {message}
        </Text>
      </Container>
    </Container>
  );
};

export default memo(PasswordInput);
