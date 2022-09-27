import { ParamListBase, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useEffect, useState } from 'react';

import {
  isCloudBackupAvailable,
  syncCloud,
  fetchUserDataFromCloud,
} from '@cardstack/models/rn-cloud';
import { Routes } from '@cardstack/navigation/routes';
import { ICloudBackupData } from '@cardstack/types';
import { Device } from '@cardstack/utils';

import { useWalletManager } from '@rainbow-me/hooks';
import logger from 'logger';

export const useWelcomeScreen = () => {
  const { navigate } = useNavigation<StackNavigationProp<ParamListBase>>();

  const [userData, setUserData] = useState<ICloudBackupData | null>(null);

  const { createNewWallet } = useWalletManager();

  useEffect(() => {
    const checkCloudBackupOnInit = async () => {
      try {
        const isAvailable = await isCloudBackupAvailable();

        if (isAvailable && Device.isIOS) {
          logger.log('syncing...');
          await syncCloud();
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
