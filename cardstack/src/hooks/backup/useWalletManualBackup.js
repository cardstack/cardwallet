import { captureException } from '@sentry/react-native';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { useWallets } from '@rainbow-me/hooks';
import { setWalletManualBackup } from '@rainbow-me/redux/wallets';
import logger from 'logger';

export const useWalletManualBackup = () => {
  const dispatch = useDispatch();
  const { selectedWallet } = useWallets();

  const confirmBackup = useCallback(async () => {
    try {
      await dispatch(setWalletManualBackup(selectedWallet.id));
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
};
