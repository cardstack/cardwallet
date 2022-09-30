import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, StatusBar } from 'react-native';
import { Column } from '../layout';
import {
  Button,
  CenteredContainer,
  Container,
  Icon,
  Input,
  Text,
} from '@cardstack/components';
import {
  cloudBackupPasswordMinLength,
  isCloudBackupPasswordValid,
  restoreCloudBackup,
} from '@cardstack/models/backup';
import {
  dismissKeyboardOnAndroid,
  useLoadingOverlay,
} from '@cardstack/navigation';
import { Device } from '@cardstack/utils/device';
import { isValidSeed } from '@rainbow-me/helpers/validators';
import WalletLoadingStates from '@rainbow-me/helpers/walletLoadingStates';
import { useWalletManager } from '@rainbow-me/hooks';
import logger from 'logger';

export default function RestoreCloudStep({ userData, backupSelected }) {
  const selectedBackupName = backupSelected?.name;
  const [validPassword, setValidPassword] = useState(false);
  const [incorrectPassword, setIncorrectPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [label, setLabel] = useState('Restore from backup');
  const passwordRef = useRef();

  const { importWallet } = useWalletManager();

  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

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

  const onSubmit = useCallback(async () => {
    try {
      dismissKeyboardOnAndroid();

      showLoadingOverlay({ title: WalletLoadingStates.RESTORING_WALLET });

      // restoreCloudBackup needs to return both seed and filename
      const restoredInfo = await restoreCloudBackup(
        password,
        userData,
        selectedBackupName
      );

      if (restoredInfo) {
        const { restoredSeed, backedUpWallet } = restoredInfo;

        if (isValidSeed(restoredSeed)) {
          await importWallet({
            seed: restoredSeed,
            backedUpWallet,
          });
          return;
        }

        logger.sentry('Error while restoring backup, invalid seed');
      }
    } catch (e) {
      setIncorrectPassword(true);

      logger.sentry('Error while restoring backup', e);
      Alert.alert('Error while restoring backup');
    } finally {
      dismissLoadingOverlay();
    }
  }, [
    dismissLoadingOverlay,
    importWallet,
    password,
    selectedBackupName,
    showLoadingOverlay,
    userData,
  ]);

  const onPasswordSubmit = useCallback(() => {
    validPassword && onSubmit();
  }, [onSubmit, validPassword]);

  return (
    <Column>
      <StatusBar barStyle="light-content" />
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
      <CenteredContainer>
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
      </CenteredContainer>
    </Column>
  );
}
