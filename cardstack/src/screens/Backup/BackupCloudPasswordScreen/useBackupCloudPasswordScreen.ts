import { eq } from 'lodash';
import { useCallback, useMemo, useRef, useState } from 'react';
import { TextInput } from 'react-native';

import { usePasswordInput } from '@cardstack/components';
import {
  hasAtLeastOneDigit,
  matchMinLength,
} from '@cardstack/utils/validators';

export const useBackupCloudPasswordScreen = () => {
  const [checked, setChecked] = useState(false);

  const { onChangeText, isValid, password } = usePasswordInput({
    validation: (text: string) =>
      hasAtLeastOneDigit(text) && matchMinLength(text, 8),
  });

  const {
    onChangeText: onChangeConfirmation,
    isValid: isValidConfirmation,
    password: confirmation,
  } = usePasswordInput({
    validation: (text: string) => matchMinLength(text, 1) && eq(password, text),
  });

  const onCheckboxPress = useCallback(() => {
    setChecked(!checked);
  }, [checked]);

  const isSubmitDisabled = useMemo(
    () => !isValid || !isValidConfirmation || !checked,
    [isValid, isValidConfirmation, checked]
  );

  const passwordRef = useRef<TextInput>();
  const confirmPasswordRef = useRef<TextInput>();

  const onPasswordSubmit = useCallback(() => {
    confirmPasswordRef.current?.focus();
  }, []);

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
    passwordRef,
    confirmPasswordRef,
    onPasswordSubmit,
  };
};
