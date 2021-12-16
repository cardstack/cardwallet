import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, InteractionManager } from 'react-native';
import { useDispatch } from 'react-redux';
import {
  fetchBackupPassword,
  restoreCloudBackup,
  saveBackupPassword,
} from '../../model/backup';
import BackupSheetKeyboardLayout from './BackupSheetKeyboardLayout';
import { Button, Container, Icon, Input, Text } from '@cardstack/components';
import { Device } from '@cardstack/utils/device';
import {
  cloudBackupPasswordMinLength,
  isCloudBackupPasswordValid,
} from '@rainbow-me/handlers/cloudBackup';
import { removeWalletData } from '@rainbow-me/handlers/localstorage/removeWallet';
import walletBackupTypes from '@rainbow-me/helpers/walletBackupTypes';
import WalletLoadingStates from '@rainbow-me/helpers/walletLoadingStates';
import {
  useAccountSettings,
  useInitializeWallet,
  useWallets,
} from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import {
  addressSetSelected,
  setWalletBackedUp,
  walletsLoadState,
  walletsSetSelected,
} from '@rainbow-me/redux/wallets';
import Routes from '@rainbow-me/routes';
import logger from 'logger';

export default function RestoreCloudStep({
  userData,
  backupSelected,
  fromSettings,
}) {
  const selectedBackupName = backupSelected?.name;
  const dispatch = useDispatch();
  const { navigate, goBack, replace } = useNavigation();
  const { setIsWalletLoading } = useWallets();
  const [validPassword, setValidPassword] = useState(false);
  const [incorrectPassword, setIncorrectPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [label, setLabel] = useState('Restore from backup');
  const passwordRef = useRef();
  const { accountAddress } = useAccountSettings();
  const initializeWallet = useInitializeWallet();

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

  const onSubmit = useCallback(async () => {
    try {
      setIsWalletLoading(WalletLoadingStates.RESTORING_WALLET);
      const success = await restoreCloudBackup(
        password,
        userData,
        selectedBackupName
      );
      if (success) {
        // Store it in the keychain in case it was missing
        await saveBackupPassword(password);

        // Get rid of the current wallet
        await removeWalletData(accountAddress);

        goBack();

        InteractionManager.runAfterInteractions(async () => {
          const wallets = await dispatch(walletsLoadState());
          if (!userData && selectedBackupName) {
            goBack();
            logger.log('updating backup state of wallets');
            await Promise.all(
              Object.keys(wallets).map(walletId => {
                logger.log('updating backup state of wallet', walletId);
                logger.log('selectedBackupName', selectedBackupName);
                // Mark the wallet as backed up
                return dispatch(
                  setWalletBackedUp(
                    walletId,
                    walletBackupTypes.cloud,
                    selectedBackupName
                  )
                );
              })
            );
            logger.log('done updating backup state');
          }
          const firstWallet = wallets[Object.keys(wallets)[0]];
          const firstAddress = firstWallet.addresses[0].address;
          const p1 = dispatch(walletsSetSelected(firstWallet));
          const p2 = dispatch(addressSetSelected(firstAddress));
          await Promise.all([p1, p2]);
          await initializeWallet();
          if (fromSettings) {
            logger.log('navigating to wallet');
            navigate(Routes.WALLET_SCREEN);
            logger.log('initializing wallet');
          } else {
            replace(Routes.SWIPE_LAYOUT);
          }
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
  }, [
    accountAddress,
    selectedBackupName,
    dispatch,
    fromSettings,
    goBack,
    initializeWallet,
    navigate,
    password,
    replace,
    setIsWalletLoading,
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
