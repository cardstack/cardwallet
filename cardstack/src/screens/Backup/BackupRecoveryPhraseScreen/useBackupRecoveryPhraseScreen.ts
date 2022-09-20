import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

import { getSeedPhrase } from '@cardstack/models/secure-storage';
import { Routes } from '@cardstack/navigation';

import { useWallets } from '@rainbow-me/hooks';

export const useBackupRecoveryPhraseScreen = () => {
  const { navigate } = useNavigation();
  const { latestBackup, selectedWallet } = useWallets();
  const [seedPhrase, setSeedPhrase] = useState('');

  const loadSeedPhrase = useCallback(async () => {
    const seedphrase = await getSeedPhrase(selectedWallet.id);

    setSeedPhrase(seedphrase);
  }, [selectedWallet]);

  useEffect(() => {
    loadSeedPhrase();
  }, [loadSeedPhrase]);

  const handleCloudBackupOnPress = useCallback(
    () => navigate(Routes.BACKUP_CLOUD_PASSWORD, { seedPhrase }),
    [navigate, seedPhrase]
  );

  const handleManualBackupOnPress = useCallback(() => {
    // TBD
  }, []);

  return {
    handleCloudBackupOnPress,
    handleManualBackupOnPress,
    latestBackup,
    seedPhrase,
  };
};
