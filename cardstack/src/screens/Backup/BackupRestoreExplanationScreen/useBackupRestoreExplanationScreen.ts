import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

import { fetchUserDataFromCloud } from '@cardstack/models/rn-cloud';
import { Routes } from '@cardstack/navigation';

import { Alert } from '@rainbow-me/components/alerts';
import { logger } from '@rainbow-me/utils';

import { strings } from './strings';

export const useBackupRestoreExplanationScreen = () => {
  const { navigate } = useNavigation();

  const handleRestoreCloudOnPress = useCallback(async () => {
    try {
      logger.log('[BACKUP] fetching backup info...');
      const data = await fetchUserDataFromCloud();

      if (data) {
        logger.log(`[BACKUP] Downloaded backup info`);

        navigate(Routes.BACKUP_RESTORE_CLOUD, { userData: data });
      }
    } catch (e) {
      logger.log('[BACKUP] Error getting userData', e);
      Alert(strings.errorMessage);
    }
  }, [navigate]);

  return {
    handleRestoreCloudOnPress,
  };
};
