import { useNavigation, useRoute } from '@react-navigation/native';
import lang from 'i18n-js';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DelayedAlert } from '../alerts';
import {
  BackupPasswordButtonFooter,
  backupPasswordInputProps,
} from './backupComponentsUtils';
import {
  CenteredContainer,
  Container,
  Icon,
  Input,
  Text,
} from '@cardstack/components';
import { isCloudBackupPasswordValid } from '@cardstack/models/backup';
import { Routes } from '@cardstack/navigation';
import { Device } from '@cardstack/utils/device';
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
  const { selectedWallet } = useWallets();
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

  const onError = useCallback(msg => {
    passwordRef.current?.focus();
    DelayedAlert({ title: msg }, 500);
  }, []);

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
    <>
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
      <CenteredContainer>
        <BackupPasswordButtonFooter
          buttonLabel={label}
          isValidPassword={validPassword}
          onButtonPress={onSubmit}
        />
      </CenteredContainer>
    </>
  );
}
