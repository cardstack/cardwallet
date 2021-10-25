import { ParamListBase, useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useEffect, useState } from 'react';
import {
  fetchUserDataFromCloud,
  isCloudBackupAvailable,
} from '@rainbow-me/handlers/cloudBackup';

import { Device } from '@cardstack/utils';
import { useHideSplashScreen } from '@rainbow-me/hooks';
import Routes from '@rainbow-me/routes';
import logger from 'logger';

export const useWelcomeScreen = () => {
  const { navigate, replace } = useNavigation<
    StackNavigationProp<ParamListBase>
  >();

  const [userData, setUserData] = useState(null);

  const hideSplashScreen = useHideSplashScreen();

  useEffect(() => {
    const checkCloudBackupOnInit = async () => {
      try {
        logger.log(`downloading backup info...`);
        const isAvailable = await isCloudBackupAvailable();

        if (isAvailable && Device.isIOS) {
          const data = await fetchUserDataFromCloud();
          setUserData(data);
          logger.log(`Downloaded backup info`);
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
