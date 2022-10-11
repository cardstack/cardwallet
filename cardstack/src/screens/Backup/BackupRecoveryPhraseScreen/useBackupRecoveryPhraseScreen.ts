import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

import { useSelectedWallet, useWalletCloudBackup } from '@cardstack/hooks';
import { Routes } from '@cardstack/navigation';

export const useBackupRecoveryPhraseScreen = () => {
  const { navigate } = useNavigation();
  const { seedPhrase, hasManualBackup, hasCloudBackup } = useSelectedWallet();
  const { deleteCloudBackups } = useWalletCloudBackup();

  const handleCloudBackupOnPress = useCallback(
    () =>
      navigate(Routes.BACKUP_CLOUD_PASSWORD, {
        popStackOnSuccess: 1,
      }),
    [navigate]
  );

  const handleManualBackupOnPress = useCallback(() => {
    navigate(Routes.BACKUP_MANUAL_BACKUP, {
      seedPhrase,
      popStackOnSuccess: 2,
    });
  }, [navigate, seedPhrase]);

  const handleDeleteOnPress = useCallback(() => {
    deleteCloudBackups();
  }, [deleteCloudBackups]);

  return {
    handleCloudBackupOnPress,
    handleManualBackupOnPress,
    handleDeleteOnPress,
    seedPhrase,
    hasManualBackup,
    hasCloudBackup,
  };
};
