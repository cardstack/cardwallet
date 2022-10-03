import { captureException } from '@sentry/react-native';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { Alert } from '@rainbow-me/components/alerts';
import { useWallets } from '@rainbow-me/hooks';
import { setWalletManualBackup } from '@rainbow-me/redux/wallets';
import logger from 'logger';

const savingManualBackupError = {
  title: 'Error while saving your wallet as manually backed up',
  message:
    'No information was lost, but your wallet will still appear as not backed-up. Please restart the app and try again',
};

export const useWalletManualBackup = () => {
  const dispatch = useDispatch();
  const { selectedWallet } = useWallets();

  const confirmBackup = useCallback(async () => {
    try {
      await dispatch(setWalletManualBackup(selectedWallet.id));
    } catch (e) {
      logger.sentry(
        `[BACKUP] Error setting manual backup for wallet ID: ${selectedWallet.id}`
      );

      Alert(savingManualBackupError);

      captureException(e);
    }
  }, [selectedWallet, dispatch]);

  return {
    confirmBackup,
  };
};
