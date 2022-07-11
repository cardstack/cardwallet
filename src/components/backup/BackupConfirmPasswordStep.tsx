import { useNavigation, useRoute } from '@react-navigation/native';
import lang from 'i18n-js';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DelayedAlert } from '../alerts';
import BackupSheetKeyboardLayout from './BackupSheetKeyboardLayout';
import {
  BackupPasswordButtonFooter,
  backupPasswordInputProps,
} from './backupComponentsUtils';
import { Container, Icon, Input, Text } from '@cardstack/components';
import { Routes } from '@cardstack/navigation';
import { Device } from '@cardstack/utils/device';
import { isCloudBackupPasswordValid } from '@rainbow-me/handlers/cloudBackup';
import {
  useRouteExistsInNavigationState,
  useWalletCloudBackup,
  useWallets,
} from '@rainbow-me/hooks';

const { cloudPlatform } = Device;

export default function BackupConfirmPasswordStep() {
  const { params } = useRoute();
  const { goBack } = useNavigation();
  const walletCloudBackup = useWalletCloudBackup();

  const [validPassword, setValidPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [label, setLabel] = useState('Confirm Backup');
  const passwordRef = useRef<any>();
  const { selectedWallet, setIsWalletLoading } = useWallets();
  const walletId = (params as any)?.walletId || selectedWallet.id;

  const isSettingsRoute = useRouteExistsInNavigationState(
    Routes.SETTINGS_MODAL
  );

  useEffect(() => {
    let passwordIsValid = false;

    if (isCloudBackupPasswordValid(password)) {
      passwordIsValid = true;
      setLabel(`Add to ${cloudPlatform} Backup`);
    }
    setValidPassword(passwordIsValid);
  }, [password]);

  const onPasswordChange = useCallback(
    ({ nativeEvent: { text: inputText } }) => {
      setPassword(inputText);
    },
    []
  );

  const onError = useCallback(
    msg => {
      passwordRef.current?.focus();
      setIsWalletLoading(null);
      DelayedAlert({ title: msg }, 500);
    },
    [setIsWalletLoading]
  );

  const onSuccess = useCallback(async () => {
    if (!isSettingsRoute) {
      DelayedAlert({ title: lang.t('cloud.backup_success') }, 1000);
    }
    // This means the user didn't have the password saved
    // and at least an other account already backed up

    goBack();
  }, [goBack, isSettingsRoute]);

  const onSubmit = useCallback(async () => {
    if (!validPassword) return;
    await walletCloudBackup({
      onError,
      onSuccess,
      password,
      walletId,
    });
  }, [
    onError,
    onSuccess,
    password,
    validPassword,
    walletCloudBackup,
    walletId,
  ]);
  return (
    <BackupSheetKeyboardLayout
      footer={
        <BackupPasswordButtonFooter
          buttonLabel={label}
          isValidPassword={validPassword}
          onButtonPress={onSubmit}
        />
      }
    >
      <Container flex={1}>
        <Container alignItems="center" padding={9}>
          <Icon color="settingsTeal" iconSize="xl" name="lock" />
          <Text fontSize={20} margin={4}>
            Enter backup password
          </Text>
          <Text color="blueText" textAlign="center">
            To add this account to your {cloudPlatform} backup, enter your
            existing backup password
          </Text>
        </Container>
        <Container margin={4}>
          <Input
            {...backupPasswordInputProps}
            autoFocus
            onChange={onPasswordChange}
            onSubmitEditing={onSubmit}
            placeholder="Backup Password"
            ref={passwordRef}
          />
        </Container>
      </Container>
    </BackupSheetKeyboardLayout>
  );
}
