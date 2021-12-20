import { useRoute } from '@react-navigation/native';
import { forEach } from 'lodash';
import React, { useCallback } from 'react';
import { InteractionManager, StatusBar } from 'react-native';
import RestoreCloudStep from '../components/backup/RestoreCloudStep';
import RestoreSheetFirstStep from '../components/backup/RestoreSheetFirstStep';

import { Sheet } from '@cardstack/components';
import { Device, layoutEasingAnimation } from '@cardstack/utils';
import {
  CLOUD_BACKUP_ERRORS,
  fetchUserDataFromCloud,
} from '@rainbow-me/handlers/cloudBackup';
import WalletBackupStepTypes from '@rainbow-me/helpers/walletBackupStepTypes';
import WalletBackupTypes from '@rainbow-me/helpers/walletBackupTypes';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';

export default function RestoreSheet() {
  const { goBack, navigate, setParams } = useNavigation();
  const {
    params: {
      step = WalletBackupStepTypes.first,
      userData,
      backupSelected,
      fromSettings,
    } = {},
  } = useRoute();
  const [noBackupsFound, setNoBackupsFound] = useState(false);
  const [isFetchingBackups, setIsFetchingBackups] = useState(false);

  const onCloudRestore = useCallback(async () => {
    try {
      if (Device.isAndroid) {
        // we didn't yet fetch the user data from the cloud
        setIsFetchingBackups(true);
        const data = await fetchUserDataFromCloud();
        setParams({ userData: data });
      }

      // Animate transforming into backup sheet
      layoutEasingAnimation();
      setParams({ step: WalletBackupStepTypes.cloud });
    } catch (e) {
      if (e.message === CLOUD_BACKUP_ERRORS.NO_BACKUPS_FOUND) {
        setNoBackupsFound(true);
      } else {
        throw e;
      }
    } finally {
      setIsFetchingBackups(false);
    }
  }, [setParams, setNoBackupsFound, setIsFetchingBackups]);

  const onManualRestore = useCallback(() => {
    InteractionManager.runAfterInteractions(goBack);
    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => navigate(Routes.IMPORT_SEED_SHEET), 50);
    });
  }, [goBack, navigate]);

  const walletsBackedUp = useMemo(() => {
    let count = 0;
    forEach(userData?.wallets, wallet => {
      if (wallet.backedUp && wallet.backupType === WalletBackupTypes.cloud) {
        count++;
      }
    });
    return count;
  }, [userData]);

  const enableCloudRestore = walletsBackedUp > 0;

  const isCloudStep = step === WalletBackupStepTypes.cloud;

  return (
    <Sheet isFullScreen={isCloudStep} scrollEnabled={isCloudStep}>
      <StatusBar barStyle="light-content" />
      {isCloudStep ? (
        <RestoreCloudStep
          backupSelected={backupSelected}
          fromSettings={fromSettings}
          userData={userData}
        />
      ) : (
        <RestoreSheetFirstStep
          enableCloudRestore={enableCloudRestore}
          isFetchingBackups={isFetchingBackups}
          noBackupsFound={noBackupsFound}
          onCloudRestore={onCloudRestore}
          onManualRestore={onManualRestore}
          walletsBackedUp={walletsBackedUp}
        />
      )}
    </Sheet>
  );
}
