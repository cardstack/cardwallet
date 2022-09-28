import { ParamListBase, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useEffect, useState } from 'react';

import {
  isIOSCloudBackupAvailable,
  syncCloudIOS,
  fetchUserDataFromCloud,
} from '@cardstack/models/rn-cloud';
import { Routes } from '@cardstack/navigation/routes';
import { BackupSecretsData } from '@cardstack/types';
import { Device } from '@cardstack/utils';

import { useWalletManager } from '@rainbow-me/hooks';
import logger from 'logger';

export const useWelcomeScreen = () => {
  const { navigate } = useNavigation<StackNavigationProp<ParamListBase>>();

  const [userData, setUserData] = useState<BackupSecretsData | null>(null);

  const { createNewWallet } = useWalletManager();

  useEffect(() => {
    const checkCloudBackupOnInit = async () => {
      try {
        const isAvailable = await isIOSCloudBackupAvailable();

        if (isAvailable && Device.isIOS) {
          logger.log('syncing...');
          await syncCloudIOS();
          logger.log('fetching backup info...');
          const data = await fetchUserDataFromCloud();

          if (data) {
            setUserData(data);
            logger.log(`Downloaded backup info`);
          } else {
            logger.log('No backups found');
          }
        }
      } catch (e) {
        logger.log('error getting userData', e);
      }
    };

    checkCloudBackupOnInit();
  }, []);

  const onCreateWallet = useCallback(() => {
    createNewWallet();
  }, [createNewWallet]);

  const onAddExistingWallet = useCallback(() => {
    navigate(Routes.RESTORE_SHEET, {
      userData,
    });
  }, [navigate, userData]);

  return { onCreateWallet, onAddExistingWallet };
};
