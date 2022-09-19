import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

import { Routes } from '@cardstack/navigation';

import { useWallets } from '@rainbow-me/hooks';

export const useBackupRecoveryPhraseScreen = () => {
  const { navigate } = useNavigation();
  const { wallets } = useWallets();

  const handleCloudBackupOnPress = useCallback(
    () => navigate(Routes.BACKUP_CLOUD_PASSWORD),
    [navigate]
  );

  const handleManualBackupOnPress = useCallback(() => {
    // TBD
  }, []);

  console.log('[LOG] wallets', wallets);

  return {
    handleCloudBackupOnPress,
    handleManualBackupOnPress,
  };
};
