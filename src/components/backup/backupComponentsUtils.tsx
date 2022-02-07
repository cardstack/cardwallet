import React, { useMemo } from 'react';
import { TextInputProps } from 'react-native';
import {
  BaseInputProps,
  Button,
  IconName,
  IconProps,
  InputProps,
  Text,
} from '@cardstack/components';
import { cloudBackupPasswordMinLength } from '@rainbow-me/handlers/cloudBackup';
import { useBiometryIconName } from '@rainbow-me/hooks';

export const backupPasswordInputProps: Partial<
  TextInputProps & InputProps & BaseInputProps
> = {
  autoCompleteType: 'password',
  blurOnSubmit: false,
  border: true,
  marginVertical: 2,
  passwordRules: `minlength: ${cloudBackupPasswordMinLength};`,
  secureTextEntry: true,
  selectTextOnFocus: true,
  textContentType: 'password',
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
  const biometryIconName = useBiometryIconName();

  const biometryIconProps: IconProps | undefined = useMemo(
    () =>
      biometryIconName
        ? {
            iconSize: 'medium',
            marginRight: 3,
            name: biometryIconName as IconName,
          }
        : undefined,
    [biometryIconName]
  );

  return isValidPassword ? (
    <Button iconProps={biometryIconProps} onPress={onButtonPress}>
      {buttonLabel}
    </Button>
  ) : (
    <Text variant="subText">Minimum 8 characters</Text>
  );
};
