import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

import { getSeedPhrase } from '@cardstack/models/secure-storage';
import { Routes } from '@cardstack/navigation';

import WalletBackupTypes from '@rainbow-me/helpers/walletBackupTypes';
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
    });
  }, [navigate, seedPhrase]);

  const handleDeleteOnPress = useCallback(() => {
    // TBD.
  }, []);

  return {
    handleCloudBackupOnPress,
    handleManualBackupOnPress,
    handleDeleteOnPress,
    seedPhrase,
    hasCloudBackup:
      selectedWallet.backedUp &&
      selectedWallet.backupType === WalletBackupTypes.cloud,
    hasManualBackup:
      selectedWallet.backedUp &&
      selectedWallet.backupType === WalletBackupTypes.manual,
  };
};
