import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import {
  fetchBackupPassword,
  restoreCloudBackup,
  saveBackupPassword,
} from '../../model/backup';
import BackupSheetKeyboardLayout from './BackupSheetKeyboardLayout';
import { Button, Container, Icon, Input, Text } from '@cardstack/components';
import {
  dismissKeyboardOnAndroid,
  useLoadingOverlay,
} from '@cardstack/navigation';
import { Device } from '@cardstack/utils/device';
import {
  cloudBackupPasswordMinLength,
  isCloudBackupPasswordValid,
} from '@rainbow-me/handlers/cloudBackup';
import { removeWalletData } from '@rainbow-me/handlers/localstorage/removeWallet';
import WalletLoadingStates from '@rainbow-me/helpers/walletLoadingStates';
import { useAccountSettings, useWalletManager } from '@rainbow-me/hooks';

export default function RestoreCloudStep({
  userData,
  backupSelected,
  fromSettings,
}) {
  const selectedBackupName = backupSelected?.name;
  const [validPassword, setValidPassword] = useState(false);
  const [incorrectPassword, setIncorrectPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [label, setLabel] = useState('Restore from backup');
  const passwordRef = useRef();
  const { accountAddress } = useAccountSettings();
  const { initWalletResetNavState } = useWalletManager();

  useEffect(() => {
    const fetchPasswordIfPossible = async () => {
      const pwd = await fetchBackupPassword();
      if (pwd) {
        setPassword(pwd);
      }
    };
    fetchPasswordIfPossible();
  }, []);

  useEffect(() => {
    let newLabel = '';
    let passwordIsValid = false;

    if (incorrectPassword) {
      newLabel = 'Incorrect Password';
    } else {
      if (isCloudBackupPasswordValid(password)) {
        passwordIsValid = true;
      }

      newLabel = `Restore from ${Device.cloudPlatform}`;
    }

    setValidPassword(passwordIsValid);
    setLabel(newLabel);
  }, [incorrectPassword, password]);

  const onPasswordChange = useCallback(
    ({ nativeEvent: { text: inputText } }) => {
      setPassword(inputText);
      setIncorrectPassword(false);
    },
    []
  );

  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  const onSubmit = useCallback(async () => {
    try {
      dismissKeyboardOnAndroid();

      showLoadingOverlay({ title: WalletLoadingStates.RESTORING_WALLET });
      const success = await restoreCloudBackup(
        password,
        userData,
        selectedBackupName
      );

      if (success) {
        // Store it in the keychain in case it was missing
        await saveBackupPassword(password);

        if (accountAddress) {
          // Get rid of the current wallet
          await removeWalletData(accountAddress);
        }

        await initWalletResetNavState(undefined, fromSettings);
      } else {
        setIncorrectPassword(true);
        dismissLoadingOverlay();
      }
    } catch (e) {
      dismissLoadingOverlay();
      Alert.alert('Error while restoring backup');
    }
  }, [
    accountAddress,
    dismissLoadingOverlay,
    fromSettings,
    initWalletResetNavState,
    password,
    selectedBackupName,
    showLoadingOverlay,
    userData,
  ]);

  const onPasswordSubmit = useCallback(() => {
    validPassword && onSubmit();
  }, [onSubmit, validPassword]);

  return (
    <BackupSheetKeyboardLayout
      footer={
        <Container>
          <Button
            disabled={!validPassword}
            iconProps={
              !incorrectPassword
                ? {
                    iconSize: 'large',
                    stroke: validPassword ? 'black' : undefined,
                    marginRight: 3,
                    name: 'refresh',
                  }
                : null
            }
            onPress={onPasswordSubmit}
          >
            {label}
          </Button>
        </Container>
      }
    >
      <Container
        alignItems="center"
        marginVertical={{
          phone: 10,
          tinyPhone: 2,
        }}
        padding={9}
      >
        <Icon color="settingsTeal" iconSize="xl" name="lock" />
        <Text fontSize={20} margin={3}>
          Enter password
        </Text>
        <Text color="blueText" textAlign="center">
          Restore your account with the password you created for your backup.
        </Text>
      </Container>
      <Container flex={1} margin={5} textAlign="center">
        <Input
          autoCompleteType="password"
          blurOnSubmit={false}
          border
          marginVertical={2}
          onChange={onPasswordChange}
          onSubmitEditing={onPasswordSubmit}
          passwordRules={`minlength: ${cloudBackupPasswordMinLength};`}
          placeholder="Password"
          ref={passwordRef}
          returnKeyType="next"
          secureTextEntry
          selectTextOnFocus
          textContentType="newPassword"
          type="password"
          value={password}
        />
      </Container>
    </BackupSheetKeyboardLayout>
  );
}
