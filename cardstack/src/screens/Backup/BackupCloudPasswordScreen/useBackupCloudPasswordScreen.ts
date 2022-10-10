import {
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useCallback, useMemo, useRef, useState } from 'react';
import { TextInput } from 'react-native';

import { usePasswordInput } from '@cardstack/components';
import { useWalletCloudBackup } from '@cardstack/hooks';
import { useShowOnboarding } from '@cardstack/hooks/onboarding/useShowOnboarding';
import { cloudBackupPasswordMinLength } from '@cardstack/models/backup';
import { RouteType } from '@cardstack/navigation/types';
import {
  hasAtLeastOneDigit,
  matchMinLength,
} from '@cardstack/utils/validators';

import { BackupRouteParams } from '../types';

export const useBackupCloudPasswordScreen = () => {
  const { params } = useRoute<RouteType<BackupRouteParams>>();

  const { dispatch: navDispatch } = useNavigation();

  const [checked, setChecked] = useState(false);
  const { backupToCloud } = useWalletCloudBackup();
  const { navigateToNextOnboardingStep } = useShowOnboarding();

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

  const handleBackupToCloud = useCallback(async () => {
    await backupToCloud({ password });

    if (params?.popStackOnSuccess) {
      navDispatch(StackActions.pop(params?.popStackOnSuccess));
    } else {
      navigateToNextOnboardingStep();
    }
  }, [
    params,
    password,
    backupToCloud,
    navDispatch,
    navigateToNextOnboardingStep,
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
