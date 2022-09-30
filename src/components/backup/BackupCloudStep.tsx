import { useNavigation, useRoute } from '@react-navigation/native';
import { captureMessage } from '@sentry/react-native';
import lang from 'i18n-js';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Keyboard } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { DelayedAlert } from '../alerts';
import {
  BackupPasswordButtonFooter,
  backupPasswordInputProps,
} from './backupComponentsUtils';
import {
  CenteredContainer,
  Container,
  Icon,
  IconProps,
  Input,
  Text,
} from '@cardstack/components';
import { isCloudBackupPasswordValid } from '@cardstack/models/backup';
import { Routes } from '@cardstack/navigation';
import showWalletErrorAlert from '@rainbow-me/helpers/support';
import {
  useRouteExistsInNavigationState,
  useWalletCloudBackup,
  useWallets,
} from '@rainbow-me/hooks';

export default function BackupCloudStep() {
  const { goBack } = useNavigation();
  const { params } = useRoute();
  const walletCloudBackup = useWalletCloudBackup();
  const { selectedWallet, isDamaged } = useWallets();
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

  const walletId = (params as any)?.walletId || selectedWallet.id;
  const passwordRef = useRef<any>();
  const confirmPasswordRef = useRef<any>();

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
      DelayedAlert({ title: msg }, 500);
    },
    [onPasswordSubmit]
  );

  const onSuccess = useCallback(async () => {
    if (!isSettingsRoute) {
      DelayedAlert({ title: lang.t('cloud.backup_success') }, 1000);
    }
    // This means the user set a new password
    // and it was the first account backed up
    goBack();
  }, [goBack, isSettingsRoute]);

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

  const passwordFieldIconProps: IconProps | undefined = useMemo(
    () =>
      isCloudBackupPasswordValid(password)
        ? {
            name: 'success',
          }
        : undefined,
    [password]
  );

  const confirmPasswordFieldIconProps: IconProps | undefined = useMemo(
    () =>
      validPassword
        ? {
            name: 'success',
          }
        : undefined,
    [validPassword]
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container alignItems="center" padding={9}>
        <Icon color="settingsTeal" iconSize="xl" name="lock" />
        <Text fontSize={20} margin={3}>
          Choose a password
        </Text>
        <Text color="blueText" textAlign="center">
          Be careful with your password. If you lose it, it cannot be recovered.
        </Text>
      </Container>
      <Container margin={5}>
        <Input
          {...backupPasswordInputProps}
          autoFocus
          iconProps={passwordFieldIconProps}
          onBlur={onPasswordBlur}
          onChange={onPasswordChange}
          onSubmitEditing={onPasswordSubmit}
          placeholder="Enter password"
          ref={passwordRef}
          returnKeyType="next"
          textContentType="newPassword"
          value={password}
        />
        <Input
          {...backupPasswordInputProps}
          iconProps={confirmPasswordFieldIconProps}
          onChange={onConfirmPasswordChange}
          onSubmitEditing={onConfirmPasswordSubmit}
          placeholder="Confirm password"
          ref={confirmPasswordRef}
          value={confirmPassword}
        />
      </Container>
      <CenteredContainer>
        <BackupPasswordButtonFooter
          buttonLabel="Confirm"
          isValidPassword={validPassword}
          onButtonPress={onConfirmBackup}
        />
      </CenteredContainer>
    </TouchableWithoutFeedback>
  );
}
