import { ParamListBase, useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useEffect, useState } from 'react';
import {
  fetchUserDataFromCloud,
  isCloudBackupAvailable,
  syncCloud,
} from '@rainbow-me/handlers/cloudBackup';

import { Device } from '@cardstack/utils';
import { useHideSplashScreen } from '@rainbow-me/hooks';
import Routes from '@rainbow-me/routes';
import logger from 'logger';
import { ICloudBackupData } from '@rainbow-me/model/backup';

export const useWelcomeScreen = () => {
  const { navigate, replace } = useNavigation<
    StackNavigationProp<ParamListBase>
  >();

  const [userData, setUserData] = useState<ICloudBackupData | null>(null);

  const hideSplashScreen = useHideSplashScreen();

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
      } finally {
        hideSplashScreen();
      }
    };

    checkCloudBackupOnInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCreateWallet = useCallback(async () => {
    replace(Routes.SWIPE_LAYOUT, {
      params: { emptyWallet: true },
      screen: Routes.WALLET_SCREEN,
    });
  }, [replace]);

  const onAddExistingWallet = useCallback(() => {
    navigate(Routes.RESTORE_SHEET, {
      userData,
    });
  }, [navigate, userData]);

  return { onCreateWallet, onAddExistingWallet };
};
