import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, InteractionManager } from 'react-native';
import {
  fetchBackupPassword,
  restoreCloudBackup,
  saveBackupPassword,
} from '../../model/backup';
import { cloudPlatform } from '../../utils/platform';
import BackupSheetKeyboardLayout from './BackupSheetKeyboardLayout';
import { Button, Container, Icon, Input, Text } from '@cardstack/components';
import {
  cloudBackupPasswordMinLength,
  isCloudBackupPasswordValid,
} from '@rainbow-me/handlers/cloudBackup';
import { removeWalletData } from '@rainbow-me/handlers/localstorage/removeWallet';
import WalletLoadingStates from '@rainbow-me/helpers/walletLoadingStates';
import { useAccountSettings, useWallets } from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';

export default function RestoreCloudStep({ userData }) {
  const { goBack, replace } = useNavigation();
  const { setIsWalletLoading } = useWallets();
  const { accountAddress } = useAccountSettings();
  const [validPassword, setValidPassword] = useState(false);
  const [incorrectPassword, setIncorrectPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [label, setLabel] = useState('Restore from backup');
  const passwordRef = useRef();

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

      newLabel = `Restore from ${cloudPlatform}`;
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

  const onSubmit = useCallback(async () => {
    try {
      setIsWalletLoading(WalletLoadingStates.RESTORING_WALLET);
      const success = await restoreCloudBackup(password, userData);

      if (success) {
        // Store it in the keychain in case it was missing
        await saveBackupPassword(password);
        // Get rid of the current account
        await removeWalletData(accountAddress);
        goBack();
        InteractionManager.runAfterInteractions(async () => {
          replace(Routes.SWIPE_LAYOUT);
          setIsWalletLoading(null);
        });
      } else {
        setIncorrectPassword(true);
        setIsWalletLoading(null);
      }
    } catch (e) {
      setIsWalletLoading(null);
      Alert.alert('Error while restoring backup');
    }
  }, [accountAddress, goBack, password, replace, setIsWalletLoading, userData]);

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
