import React, { forwardRef, memo, useCallback, useMemo, useState } from 'react';

import {
  Container,
  ContainerProps,
  Icon,
  IconName,
  Input,
  InputProps,
  Text,
  Touchable,
  BaseInputProps,
} from '@cardstack/components';
import { iCloudPasswordRules } from '@cardstack/models/backup';
import { palette } from '@cardstack/theme';
import { hitSlop } from '@cardstack/utils';

const baseInputProps: InputProps = {
  paddingHorizontal: 5,
  paddingVertical: 3,
  color: 'white',
  selectionColor: 'teal',
  autoCompleteType: 'password',
  blurOnSubmit: false,
  secureTextEntry: true,
  selectTextOnFocus: true,
  textContentType: 'password',
  autoCapitalize: 'none',
  placeholderTextColor: palette.blueText,
  passwordRules: iCloudPasswordRules,
};

interface PasswordInputProps extends BaseInputProps {
  containerProps?: ContainerProps;
  isValid: boolean;
  validationMessage: string;
}

const PasswordInput = forwardRef((props: PasswordInputProps, ref) => {
  const {
    containerProps,
    onChangeText,
    value,
    isValid,
    validationMessage,
    ...inputProps
  } = props;

  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisible(!isPasswordVisible);
  }, [isPasswordVisible]);

  const iconName: IconName = useMemo(
    () => (isPasswordVisible ? 'eye-off' : 'eye'),
    [isPasswordVisible]
  );

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
            {...baseInputProps}
            {...inputProps}
            placeholderTextColor={palette.blueText}
            secureTextEntry={!isPasswordVisible}
            autoCapitalize="none"
            onChangeText={onChangeText}
            value={value}
            ref={ref}
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
          {validationMessage}
        </Text>
      </Container>
    </Container>
  );
});

export default memo(PasswordInput);
