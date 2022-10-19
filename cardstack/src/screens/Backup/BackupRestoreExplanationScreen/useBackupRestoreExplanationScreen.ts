import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

import { fetchUserDataFromCloud } from '@cardstack/models/rn-cloud';
import { Routes } from '@cardstack/navigation';
import { Device } from '@cardstack/utils';

import { Alert } from '@rainbow-me/components/alerts';
import { logger } from '@rainbow-me/utils';

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
      Alert({
        title: `Error restoring from ${Device.cloudPlatform}`,
        message: `We couldn't find a backup file on your cloud platform. If you are sure that you have a backup file, please contact support.`,
      });
    }
  }, [navigate]);

  return {
    handleRestoreCloudOnPress,
  };
};
