import React, { useMemo } from 'react';
import { TextInputProps } from 'react-native';
import { Button, IconProps, InputProps, Text } from '@cardstack/components';
import { useBiometry } from '@cardstack/hooks/useBiometry';
import { cloudBackupPasswordMinLength } from '@rainbow-me/handlers/cloudBackup';

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
  const { biometryIconProps } = useBiometry();

  const updatedIconProps: IconProps | undefined = useMemo(
    () =>
      biometryIconProps
        ? {
            ...biometryIconProps,
            iconSize: 'medium',
            marginRight: 3,
          }
        : undefined,
    [biometryIconProps]
  );

  return isValidPassword ? (
    <Button iconProps={updatedIconProps} onPress={onButtonPress}>
      {buttonLabel}
    </Button>
  ) : (
    <Text variant="subText">Minimum 8 characters</Text>
  );
};
