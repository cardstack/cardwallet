import React, { useMemo } from 'react';
import { TextInputProps } from 'react-native';
import {
  Button,
  IconName,
  IconProps,
  InputProps,
  Text,
} from '@cardstack/components';
import { cloudBackupPasswordMinLength } from '@rainbow-me/handlers/cloudBackup';
import { useBiometryType } from '@rainbow-me/hooks';

export const backupPasswordInputProps: Partial<TextInputProps & InputProps> = {
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
  const { iconName } = useBiometryType();

  const biometryIconProps: IconProps | undefined = useMemo(
    () =>
      iconName
        ? {
            iconSize: 'medium',
            marginRight: 3,
            name: iconName as IconName,
          }
        : undefined,
    [iconName]
  );

  return isValidPassword ? (
    <Button iconProps={biometryIconProps} onPress={onButtonPress}>
      {buttonLabel}
    </Button>
  ) : (
    <Text variant="subText">Minimum 8 characters</Text>
  );
};
