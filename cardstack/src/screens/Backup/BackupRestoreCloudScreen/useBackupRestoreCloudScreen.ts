import { useRoute } from '@react-navigation/native';
import { useCallback } from 'react';

import { usePasswordInput } from '@cardstack/components';
import { restoreCloudBackup } from '@cardstack/models/backup';
import {
  dismissKeyboardOnAndroid,
  useLoadingOverlay,
} from '@cardstack/navigation';
import { RouteType } from '@cardstack/navigation/types';
import { BackupUserData } from '@cardstack/types';

import { Alert } from '@rainbow-me/components/alerts';
import { isValidSeed } from '@rainbow-me/helpers/validators';
import WalletLoadingStates from '@rainbow-me/helpers/walletLoadingStates';
import { useWalletManager } from '@rainbow-me/hooks';
import logger from 'logger';

import { strings } from './strings';

interface RouteParams {
  userData: BackupUserData;
}

export const useBackupRestoreCloudScreen = () => {
  const { params } = useRoute<RouteType<RouteParams>>();
  const { password, onChangeText } = usePasswordInput();
  const { importWallet } = useWalletManager();

  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  const handleRestoreOnPress = useCallback(async () => {
    try {
      dismissKeyboardOnAndroid();

      showLoadingOverlay({ title: WalletLoadingStates.RESTORING_WALLET });

      const restoredInfo = await restoreCloudBackup(password, params.userData);

      if (restoredInfo) {
        const { restoredSeed, backedUpWallet } = restoredInfo;

        if (isValidSeed(restoredSeed)) {
          await importWallet({
            seed: restoredSeed,
            backedUpWallet,
          });

          return;
        }

        logger.sentry('Error while restoring backup, invalid seed');
      }

      dismissLoadingOverlay();
    } catch (e) {
      logger.sentry('Error while restoring backup', e);
      Alert(strings.errorMessage);
    }
  }, [
    dismissLoadingOverlay,
    importWallet,
    password,
    showLoadingOverlay,
    params,
  ]);

  return {
    isSubmitDisabled: !password,
    password,
    onChangeText,
    handleRestoreOnPress,
  };
};
