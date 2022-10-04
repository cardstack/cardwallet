import { useCallback, useEffect, useMemo, useState } from 'react';

import WalletBackupTypes from '@rainbow-me/helpers/walletBackupTypes';
import { useWallets } from '@rainbow-me/hooks';
import { loadSeedPhrase } from '@rainbow-me/model/wallet';
import { logger } from '@rainbow-me/utils';

export const useSelectedWallet = () => {
  const { walletReady, selectedWallet } = useWallets();
  const [seedPhrase, setSeedPhrase] = useState<string>('');

  const getSeedPhrase = useCallback(async () => {
    try {
      const seedphrase = await loadSeedPhrase(selectedWallet.id);

      if (seedphrase) {
        setSeedPhrase(seedphrase);
      }
    } catch (error) {
      logger.log('Error getting seed phrase', error);
    }
  }, [selectedWallet]);

  useEffect(() => {
    if (walletReady) {
      getSeedPhrase();
    }
  }, [walletReady, getSeedPhrase]);

  const hasCloudBackup = useMemo(
    () =>
      selectedWallet.backedUp &&
      selectedWallet.backupType === WalletBackupTypes.cloud,
    [selectedWallet]
  );

  const hasManualBackup = useMemo(
    () => selectedWallet.manuallyBackedUp ?? false,
    [selectedWallet]
  );

  return {
    seedPhrase,
    hasCloudBackup,
    hasManualBackup,
  };
};
