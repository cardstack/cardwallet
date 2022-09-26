import React from 'react';
import { TextInputProps } from 'react-native';
import { Button, InputProps, Text } from '@cardstack/components';
import { cloudBackupPasswordMinLength } from '@cardstack/models/backup';

export const backupPasswordInputProps: Partial<TextInputProps & InputProps> = {
  autoCompleteType: 'password',
  blurOnSubmit: false,
  border: true,
  marginVertical: 2,
  passwordRules: `minlength: ${cloudBackupPasswordMinLength};`,
  secureTextEntry: true,
  selectTextOnFocus: true,
  textContentType: 'password',
  paddingVertical: 2,
};

interface BackupButtonFooterProps {
  buttonLabel: string;
  onButtonPress: () => void;
  isValidPassword: boolean;
}

export const BackupPasswordButtonFooter = ({
  buttonLabel,
  onButtonPress,
  isValidPassword,
}: BackupButtonFooterProps) => {
  return isValidPassword ? (
    <Button onPress={onButtonPress}>{buttonLabel}</Button>
  ) : (
    <Text variant="subText">Minimum 8 characters</Text>
  );
};
