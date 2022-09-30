import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

import { Routes } from '@cardstack/navigation';

import WalletBackupTypes from '@rainbow-me/helpers/walletBackupTypes';
import { useWallets } from '@rainbow-me/hooks';

export const useBackupRecoveryPhraseScreen = () => {
  const { navigate } = useNavigation();
  const { selectedWallet, seedPhrase } = useWallets();

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
    hasManualBackup: selectedWallet.manuallyBackedUp,
  };
};
