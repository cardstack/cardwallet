import { captureException } from '@sentry/react-native';
import { useCallback } from 'react';
import { Linking } from 'react-native';
import { useDispatch } from 'react-redux';

import { backupWalletToCloud } from '@cardstack/models/backup';
import { isIOSCloudBackupAvailable } from '@cardstack/models/rn-cloud';
import { useLoadingOverlay } from '@cardstack/navigation';
import { Device } from '@cardstack/utils';

import { Alert } from '@rainbow-me/components/alerts';
import WalletBackupTypes from '@rainbow-me/helpers/walletBackupTypes';
import walletLoadingStates from '@rainbow-me/helpers/walletLoadingStates';
import { useWallets } from '@rainbow-me/hooks';
import { setWalletBackedUp } from '@rainbow-me/redux/wallets';
import { logger } from '@rainbow-me/utils';

import { getFriendlyErrorMessage } from './utils';

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
  const { selectedWallet } = useWallets();
  const dispatch = useDispatch();

  const backupToCloud = useCallback(
    async ({ password }: BackupToCloud) => {
      try {
        const isAvailable = await isIOSCloudBackupAvailable();

        if (Device.isIOS && !isAvailable) {
          Alert(iCloudAlertConfig);

          return;
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
            setWalletBackedUp(
              selectedWallet.id,
              WalletBackupTypes.cloud,
              updatedBackupFile
            )
          );

          logger.log('[BACKUP] Backup saved everywhere!');
        }

        dismissLoadingOverlay();
      } catch (error) {
        const title = `Error while trying to backup wallet to ${Device.cloudPlatform}`;

        const message = getFriendlyErrorMessage(error.message);

        Alert({
          title,
          message,
        });

        logger.sentry(`${title}: ${message}`);
        captureException(error);
      }
    },
    [showLoadingOverlay, selectedWallet, dismissLoadingOverlay, dispatch]
  );

  return {
    backupToCloud,
  };
};
