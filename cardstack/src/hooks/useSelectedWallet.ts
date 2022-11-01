import { useCallback, useEffect, useState } from 'react';

import { isBackedUpWallet } from '@cardstack/models/backup';

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
    if (walletReady && !seedPhrase) {
      getSeedPhrase();
    }

    console.log(':::', { walletReady, seedPhrase });
  }, [walletReady, getSeedPhrase, seedPhrase]);

  return {
    seedPhrase,
    hasCloudBackup: isBackedUpWallet(selectedWallet),
    hasManualBackup: selectedWallet?.manuallyBackedUp,
  };
};
