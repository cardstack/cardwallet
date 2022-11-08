import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

import { fetchUserDataFromCloud } from '@cardstack/models/rn-cloud';
import { Routes, useLoadingOverlay } from '@cardstack/navigation';

import { Alert } from '@rainbow-me/components/alerts';
import logger from 'logger';

import { strings } from './strings';

export const useBackupRestoreExplanationScreen = () => {
  const { navigate } = useNavigation();
  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  const handleRestoreCloudOnPress = useCallback(async () => {
    try {
      showLoadingOverlay({ title: 'Fetching backup information...' });

      logger.log('[BACKUP] fetching backup info...');
      const data = await fetchUserDataFromCloud();

      dismissLoadingOverlay();

      if (data) {
        logger.log(`[BACKUP] Downloaded backup info`);
        navigate(Routes.BACKUP_RESTORE_CLOUD, { userData: data });
      }
    } catch (e) {
      dismissLoadingOverlay();
      logger.sentry('[BACKUP] Error getting userData', e);
      Alert(strings.errorMessage);
    }
  }, [navigate, dismissLoadingOverlay, showLoadingOverlay]);

  const handleRestorePhraseOnPress = useCallback(() => {
    navigate(Routes.BACKUP_RESTORE_PHRASE);
  }, [navigate]);

  return {
    handleRestoreCloudOnPress,
    handleRestorePhraseOnPress,
  };
};
