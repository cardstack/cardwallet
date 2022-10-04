import { StackActions, useNavigation } from '@react-navigation/native';
import { captureException } from '@sentry/react-native';
import { useCallback } from 'react';
import { Linking } from 'react-native';
import { useDispatch } from 'react-redux';

import { backupWalletToCloud } from '@cardstack/models/backup';
import {
  CLOUD_BACKUP_ERRORS,
  deleteAllBackups,
  isIOSCloudBackupAvailable,
} from '@cardstack/models/rn-cloud';
import { useLoadingOverlay } from '@cardstack/navigation';
import { Device } from '@cardstack/utils';

import { Alert } from '@rainbow-me/components/alerts';
import walletLoadingStates from '@rainbow-me/helpers/walletLoadingStates';
import { useWallets } from '@rainbow-me/hooks';
import { setWalletCloudBackup, walletsUpdate } from '@rainbow-me/redux/wallets';
import { logger } from '@rainbow-me/utils';

interface BackupToCloud {
  password: string;
}

const iCloudAlertConfig = {
  title: 'iCloud Not Enabled',
  message: `Looks like iCloud drive is not enabled on your device.
Do you want to see how to enable it?`,
  buttons: [
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
  ],
};

export const useWalletCloudBackup = () => {
  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();
  const { selectedWallet, wallets } = useWallets();
  const dispatch = useDispatch();
  const { dispatch: navDispatch } = useNavigation();

  const backupToCloud = useCallback(
    async ({ password }: BackupToCloud) => {
      try {
        if (Device.isIOS) {
          const isAvailable = await isIOSCloudBackupAvailable();

          if (!isAvailable) {
            Alert(iCloudAlertConfig);

            return;
          }
        }

        showLoadingOverlay({ title: walletLoadingStates.BACKING_UP_WALLET });

        logger.log(
          `[BACKUP] Backing up to ${Device.cloudPlatform}`,
          selectedWallet
        );

        const updatedBackupFile = await backupWalletToCloud(
          password,
          selectedWallet
        );

        if (updatedBackupFile) {
          logger.log('[BACKUP] Backup completed!');
          await dispatch(
            setWalletCloudBackup(selectedWallet.id, updatedBackupFile)
          );

          logger.log('[BACKUP] Backup saved everywhere!');
          dismissLoadingOverlay();
          navDispatch(StackActions.popToTop());
        }
      } catch (error) {
        dismissLoadingOverlay();

        const title = `Error while trying to backup wallet to ${Device.cloudPlatform}`;

        const message =
          error?.message ||
          CLOUD_BACKUP_ERRORS.WALLET_BACKUP_STATUS_UPDATE_FAILED;

        Alert({
          title,
          message,
        });

        logger.sentry(`[BACKUP] ${message}`);
        captureException(error);
      }
    },
    [
      showLoadingOverlay,
      selectedWallet,
      dismissLoadingOverlay,
      dispatch,
      navDispatch,
    ]
  );

  const handleOnPressConfirm = useCallback(async () => {
    showLoadingOverlay({ title: 'Deleting backup...' });

    try {
      await deleteAllBackups();

      const updatedWallets = { ...wallets };
      Object.keys(updatedWallets).forEach(key => {
        updatedWallets[key].backedUp = false;
        updatedWallets[key].backupDate = undefined;
        updatedWallets[key].backupFile = undefined;
        updatedWallets[key].backupType = undefined;
      });

      await dispatch(walletsUpdate(updatedWallets));

      dismissLoadingOverlay();

      Alert({
        title: 'Backup successfully deleted!',
      });
    } catch (error) {
      Alert({
        title: 'Error deleting your backup files.',
        message:
          'Try again in a few minutes. Make sure you have a stable internet connection.',
      });
    }
  }, [dispatch, wallets, showLoadingOverlay, dismissLoadingOverlay]);

  const deleteCloudBackups = useCallback(() => {
    Alert({
      title: `Are you sure you want to delete your ${Device.cloudPlatform} wallet backups?`,
      buttons: [
        {
          onPress: handleOnPressConfirm,
          style: 'destructive',
          text: 'Confirm and Delete Backups',
        },
        {
          style: 'cancel',
          text: 'Cancel',
        },
      ],
    });
  }, [handleOnPressConfirm]);

  return {
    backupToCloud,
    deleteCloudBackups,
  };
};
