import { captureException } from '@sentry/react-native';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import WalletBackupTypes from '@rainbow-me/helpers/walletBackupTypes';
import { useWallets } from '@rainbow-me/hooks';
import { setWalletBackedUp } from '@rainbow-me/redux/wallets';
import logger from 'logger';

export default function useWalletManualBackup() {
  const dispatch = useDispatch();
  const { selectedWallet } = useWallets();

  const confirmBackup = useCallback(async () => {
    try {
      await dispatch(
        setWalletBackedUp(selectedWallet.id, WalletBackupTypes.manual)
      );
    } catch (e) {
      logger.sentry(
        `Error setting manual backup for wallet ID: ${selectedWallet.id}`
      );

      captureException(e);
    }
  }, [selectedWallet, dispatch]);

  return {
    confirmBackup,
  };
}
