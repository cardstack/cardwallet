import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

import { fetchUserDataFromCloud } from '@cardstack/models/rn-cloud';
import { Routes, useLoadingOverlay } from '@cardstack/navigation';

import { Alert } from '@rainbow-me/components/alerts';
import { logger } from '@rainbow-me/utils';

import { strings } from './strings';

export const useBackupRestoreExplanationScreen = () => {
  const { navigate } = useNavigation();
  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  const handleRestoreCloudOnPress = useCallback(async () => {
    try {
      showLoadingOverlay({ title: 'Fetching backup information...' });

      logger.log('[BACKUP] fetching backup info...');
      const data = await fetchUserDataFromCloud();

      if (data) {
        logger.log(`[BACKUP] Downloaded backup info`);
        navigate(Routes.BACKUP_RESTORE_CLOUD, { userData: data });
      }

      dismissLoadingOverlay();
    } catch (e) {
      logger.sentry('[BACKUP] Error getting userData', e);
      Alert(strings.errorMessage);
    }
  }, [navigate, dismissLoadingOverlay, showLoadingOverlay]);

  return {
    handleRestoreCloudOnPress,
  };
};
