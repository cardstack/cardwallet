import { eq } from 'lodash';
import { useCallback, useMemo, useState } from 'react';

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
  };
};
