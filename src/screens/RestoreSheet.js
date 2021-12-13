import { useRoute } from '@react-navigation/native';
import { forEach } from 'lodash';
import React, { useCallback } from 'react';
import { InteractionManager, StatusBar } from 'react-native';
import RestoreCloudStep from '../components/backup/RestoreCloudStep';
import RestoreSheetFirstStep from '../components/backup/RestoreSheetFirstStep';

import { Sheet } from '@cardstack/components';
import { Device, layoutEasingAnimation } from '@cardstack/utils';
import { fetchUserDataFromCloud } from '@rainbow-me/handlers/cloudBackup';
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

  const onCloudRestore = useCallback(async () => {
    // Animate transforming into backup sheet
    layoutEasingAnimation();

    if (Device.isAndroid) {
      // we didn't yet fetch the user data from the cloud
      const data = await fetchUserDataFromCloud();
      setParams({ userData: data });
    }
    setParams({ step: WalletBackupStepTypes.cloud });
  }, [setParams]);

  const onManualRestore = useCallback(() => {
    InteractionManager.runAfterInteractions(goBack);
    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => navigate(Routes.IMPORT_SEED_PHRASE_FLOW), 50);
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
          onCloudRestore={onCloudRestore}
          onManualRestore={onManualRestore}
          walletsBackedUp={walletsBackedUp}
        />
      )}
    </Sheet>
  );
}
