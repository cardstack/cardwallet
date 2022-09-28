import { captureException } from '@sentry/react-native';
import { values } from 'lodash';
import { useCallback } from 'react';
import { Alert, Linking } from 'react-native';
import { useDispatch } from 'react-redux';
import { setWalletBackedUp } from '../redux/wallets';
import useWallets from './useWallets';
import { backupWalletToCloud } from '@cardstack/models/backup';
import {
  CLOUD_BACKUP_ERRORS,
  isIOSCloudBackupAvailable,
} from '@cardstack/models/rn-cloud';
import { useLoadingOverlay } from '@cardstack/navigation';
import { Device } from '@cardstack/utils/device';
import WalletBackupTypes from '@rainbow-me/helpers/walletBackupTypes';
import walletLoadingStates from '@rainbow-me/helpers/walletLoadingStates';
import logger from 'logger';

const { cloudPlatform } = Device;

function getUserError(e: Error) {
  switch (e.message) {
    case CLOUD_BACKUP_ERRORS.KEYCHAIN_ACCESS_ERROR:
      return 'You need to authenticate to proceed with the Backup process';
    case CLOUD_BACKUP_ERRORS.ERROR_DECRYPTING_DATA:
      return 'Incorrect password! Please try again.';
    case CLOUD_BACKUP_ERRORS.SPECIFIC_BACKUP_NOT_FOUND:
      return `We couldn't find your previous backup!`;
    case CLOUD_BACKUP_ERRORS.ERROR_GETTING_ENCRYPTED_DATA:
      return `We couldn't access your backup at this time. Please try again later.`;
    case CLOUD_BACKUP_ERRORS.USER_CANCELED_DRIVE_API_AUTH:
      return `Not authorized to interact with Google Drive.`;
    default:
      return `Error while trying to backup. Error code: ${values(
        CLOUD_BACKUP_ERRORS
      ).indexOf(e.message)}`;
  }
}

export default function useWalletCloudBackup() {
  const dispatch = useDispatch();
  const { latestBackup, wallets } = useWallets();

  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  const walletCloudBackup = useCallback(
    async ({
      handleNoLatestBackup,
      handlePasswordNotFound,
      onError,
      onSuccess,
      password,
      walletId,
    }) => {
      const isAvailable = await isIOSCloudBackupAvailable();
      if (!isAvailable) {
        Alert.alert(
          'iCloud Not Enabled',
          `Looks like iCloud drive is not enabled on your device.
          Do you want to see how to enable it?`,
          [
            {
              onPress: () => {
                Linking.openURL('https://support.apple.com/en-us/HT204025');
              },
              text: 'Yes, Show me',
            },
            {
              style: 'cancel',
              text: 'No thanks',
            },
          ]
        );
        return;
      }

      if (!password && !latestBackup) {
        // No password, No latest backup meaning
        // it's a first time backup so we need to show the password sheet
        handleNoLatestBackup?.();
        return;
      }

      if (!password) {
        handlePasswordNotFound?.();
        return;
      }

      showLoadingOverlay({ title: walletLoadingStates.BACKING_UP_WALLET });

      let updatedBackupFile: string | undefined;
      try {
        logger.log(`backing up to ${cloudPlatform}`, wallets[walletId]);
        updatedBackupFile = await backupWalletToCloud(
          password,
          wallets[walletId]
        );
      } catch (e) {
        const userError = getUserError(e);
        onError?.(userError);
        logger.sentry(
          `error while trying to backup wallet to ${cloudPlatform}`
        );
        captureException(e);

        return null;
      }

      try {
        logger.log('backup completed!');
        await dispatch(
          setWalletBackedUp(
            walletId,
            WalletBackupTypes.cloud,
            updatedBackupFile
          )
        );
        logger.log('backup saved everywhere!');
        dismissLoadingOverlay();

        onSuccess?.();
      } catch (e) {
        logger.sentry('error while trying to save wallet backup state');
        captureException(e);
        const userError = getUserError(
          new Error(CLOUD_BACKUP_ERRORS.WALLET_BACKUP_STATUS_UPDATE_FAILED)
        );
        dismissLoadingOverlay();

        onError?.(userError);
      }
    },
    [dismissLoadingOverlay, dispatch, latestBackup, showLoadingOverlay, wallets]
  );

  return walletCloudBackup;
}
