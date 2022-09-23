import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

import { getSeedPhrase } from '@cardstack/models/secure-storage';
import { Routes } from '@cardstack/navigation';

import { useWallets } from '@rainbow-me/hooks';
import { logger } from '@rainbow-me/utils';

export const useBackupRecoveryPhraseScreen = () => {
  const { navigate } = useNavigation();
  const { selectedWallet } = useWallets();
  const [seedPhrase, setSeedPhrase] = useState('');

  const loadSeedPhrase = useCallback(async () => {
    try {
      const seedphrase = await getSeedPhrase(selectedWallet.id);

      setSeedPhrase(seedphrase);
    } catch (error) {
      logger.log('Error getting seed phrase', error);
    }
  }, [selectedWallet]);

  useEffect(() => {
    loadSeedPhrase();
  }, [loadSeedPhrase]);

  const handleCloudBackupOnPress = useCallback(
    () => navigate(Routes.BACKUP_CLOUD_PASSWORD, { seedPhrase }),
    [navigate, seedPhrase]
  );

  const handleManualBackupOnPress = useCallback(() => {
    navigate(Routes.BACKUP_MANUAL_BACKUP, {
      seedPhrase,
      walletId: selectedWallet.id,
    });
  }, [navigate, seedPhrase, selectedWallet]);

  return {
    handleCloudBackupOnPress,
    handleManualBackupOnPress,
    backedUp: selectedWallet.backedUp,
    seedPhrase,
  };
};
