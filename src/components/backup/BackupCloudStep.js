import { useRoute } from '@react-navigation/native';
import analytics from '@segment/analytics-react-native';
import { captureMessage } from '@sentry/react-native';
import lang from 'i18n-js';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { saveBackupPassword } from '../../model/backup';
import { cloudPlatform } from '../../utils/platform';
import { DelayedAlert } from '../alerts';
import BackupSheetKeyboardLayout from './BackupSheetKeyboardLayout';
import { Button, Container, Icon, Input, Text } from '@cardstack/components';
import {
  cloudBackupPasswordMinLength,
  isCloudBackupPasswordValid,
} from '@rainbow-me/handlers/cloudBackup';
import showWalletErrorAlert from '@rainbow-me/helpers/support';
import {
  useBiometryIconName,
  useMagicAutofocus,
  useRouteExistsInNavigationState,
  useWalletCloudBackup,
  useWallets,
} from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';
import logger from 'logger';

export default function BackupCloudStep() {
  const currentlyFocusedInput = useRef();
  const { goBack } = useNavigation();
  const { params } = useRoute();
  const walletCloudBackup = useWalletCloudBackup();
  const { selectedWallet, setIsWalletLoading, isDamaged } = useWallets();
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const biometryIconName = useBiometryIconName();

  useEffect(() => {
    if (isDamaged) {
      showWalletErrorAlert();
      captureMessage('Damaged account preventing cloud backup');
      goBack();
    }
  }, [goBack, isDamaged]);

  const isSettingsRoute = useRouteExistsInNavigationState(
    Routes.SETTINGS_MODAL
  );

  const walletId = params?.walletId || selectedWallet.id;
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      passwordRef.current?.focus();
    }, 1);
    analytics.track('Choose Password Step', {
      category: 'backup',
      label: cloudPlatform,
    });
  }, []);

  const { handleFocus } = useMagicAutofocus(passwordRef);

  const onPasswordFocus = useCallback(
    target => {
      handleFocus(target);
      setPasswordFocused(true);
      currentlyFocusedInput.current = passwordRef.current;
    },
    [handleFocus]
  );

  const onConfirmPasswordFocus = useCallback(
    target => {
      handleFocus(target);
      currentlyFocusedInput.current = confirmPasswordRef.current;
    },
    [handleFocus]
  );

  const onPasswordBlur = useCallback(() => {
    setPasswordFocused(false);
  }, []);

  const onPasswordSubmit = useCallback(() => {
    confirmPasswordRef.current?.focus();
  }, []);

  useEffect(() => {
    let passwordIsValid = false;
    if (password === confirmPassword && isCloudBackupPasswordValid(password)) {
      passwordIsValid = true;
    }

    setValidPassword(passwordIsValid);
  }, [confirmPassword, password, passwordFocused]);

  const onPasswordChange = useCallback(
    ({ nativeEvent: { text: inputText } }) => {
      setPassword(inputText);
    },
    []
  );

  const onConfirmPasswordChange = useCallback(
    ({ nativeEvent: { text: inputText } }) => {
      setConfirmPassword(inputText);
    },
    []
  );

  const onError = useCallback(
    msg => {
      setTimeout(onPasswordSubmit, 1000);
      setIsWalletLoading(null);
      DelayedAlert({ title: msg }, 500);
    },
    [onPasswordSubmit, setIsWalletLoading]
  );

  const onSuccess = useCallback(async () => {
    logger.log('BackupCloudStep:: saving backup password');
    await saveBackupPassword(password);
    if (!isSettingsRoute) {
      DelayedAlert({ title: lang.t('cloud.backup_success') }, 1000);
    }
    // This means the user set a new password
    // and it was the first account backed up
    analytics.track('Backup Complete', {
      category: 'backup',
      label: cloudPlatform,
    });
    goBack();
  }, [goBack, isSettingsRoute, password]);

  const onConfirmBackup = useCallback(async () => {
    await walletCloudBackup({
      onError,
      onSuccess,
      password,
      walletId,
    });
  }, [onError, onSuccess, password, walletCloudBackup, walletId]);

  const onConfirmPasswordSubmit = useCallback(() => {
    validPassword && onConfirmBackup();
  }, [onConfirmBackup, validPassword]);

  const sharedPasswordProps = {
    autoCompleteType: 'password',
    blurOnSubmit: false,
    border: true,
    marginVertical: 2,
    passwordRules: `minlength: ${cloudBackupPasswordMinLength};`,
    secureTextEntry: true,
    selectTextOnFocus: true,
    type: 'password',
  };

  return (
    <BackupSheetKeyboardLayout
      footer={
        validPassword ? (
          <Button
            iconProps={
              biometryIconName
                ? {
                    iconSize: 'medium',
                    marginRight: 3,
                    name: biometryIconName,
                  }
                : null
            }
            onPress={onConfirmBackup}
          >
            Confirm
          </Button>
        ) : (
          <Text variant="subText">Minimum 8 characters</Text>
        )
      }
    >
      <Container alignItems="center" marginVertical={10} padding={9}>
        <Icon color="settingsTeal" iconSize="xl" name="lock" />
        <Text fontSize={20} margin={3}>
          Choose a password
        </Text>
        <Text color="blueText" textAlign="center">
          Be careful with your password. If you lose it, it cannot be recovered.
        </Text>
      </Container>
      <Container flex={1} margin={5} textAlign="center">
        <Input
          {...sharedPasswordProps}
          iconProps={
            isCloudBackupPasswordValid(password)
              ? {
                  name: 'success',
                }
              : null
          }
          onBlur={onPasswordBlur}
          onChange={onPasswordChange}
          onFocus={onPasswordFocus}
          onSubmitEditing={onPasswordSubmit}
          placeholder="Enter password"
          ref={passwordRef}
          returnKeyType="next"
          textContentType="newPassword"
          value={password}
        />
        <Input
          {...sharedPasswordProps}
          iconProps={
            validPassword
              ? {
                  name: 'success',
                }
              : null
          }
          onChange={onConfirmPasswordChange}
          onFocus={onConfirmPasswordFocus}
          onSubmitEditing={onConfirmPasswordSubmit}
          placeholder="Confirm password"
          ref={confirmPasswordRef}
          type="password"
          value={confirmPassword}
        />
      </Container>
    </BackupSheetKeyboardLayout>
  );
}
