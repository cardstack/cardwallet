import { useCallback, useMemo, useRef, useState } from 'react';
import { TextInput } from 'react-native';

import { usePasswordInput } from '@cardstack/components';
import { useWalletCloudBackup } from '@cardstack/hooks/backup/useWalletCloudBackup';
import { cloudBackupPasswordMinLength } from '@cardstack/models/backup';
import {
  hasAtLeastOneDigit,
  matchMinLength,
} from '@cardstack/utils/validators';

export const useBackupCloudPasswordScreen = () => {
  const [checked, setChecked] = useState(false);
  const { backupToCloud } = useWalletCloudBackup();

  const { onChangeText, isValid, password } = usePasswordInput({
    validation: (text: string) =>
      hasAtLeastOneDigit(text) &&
      matchMinLength(text, cloudBackupPasswordMinLength),
  });

  const {
    onChangeText: onChangeConfirmation,
    isValid: isValidConfirmation,
    password: confirmation,
  } = usePasswordInput({
    validation: (text: string) => !!text && text === password,
  });

  const onCheckboxPress = useCallback(() => {
    setChecked(!checked);
  }, [checked]);

  const isSubmitDisabled = useMemo(
    () => !isValid || !isValidConfirmation || !checked,
    [isValid, isValidConfirmation, checked]
  );

  const confirmPasswordRef = useRef<TextInput>();

  const onPasswordSubmit = useCallback(() => {
    confirmPasswordRef.current?.focus();
  }, []);

  const handleBackupToCloud = useCallback(() => backupToCloud({ password }), [
    password,
    backupToCloud,
  ]);

  return {
    onChangeText,
    isValid,
    password,
    onChangeConfirmation,
    isValidConfirmation,
    confirmation,
    onCheckboxPress,
    checked,
    isSubmitDisabled,
    confirmPasswordRef,
    onPasswordSubmit,
    handleBackupToCloud,
  };
};
