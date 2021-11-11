import { useRoute } from '@react-navigation/native';
import { forEach } from 'lodash';
import React, { useCallback } from 'react';
import { InteractionManager, StatusBar } from 'react-native';
import { getSoftMenuBarHeight } from 'react-native-extra-dimensions-android';
import RestoreCloudStep from '../components/backup/RestoreCloudStep';
import RestoreSheetFirstStep from '../components/backup/RestoreSheetFirstStep';
import { Column } from '../components/layout';
import { SlackSheet } from '../components/sheet';

import { Device } from '@cardstack/utils';
import WalletBackupStepTypes from '@rainbow-me/helpers/walletBackupStepTypes';
import WalletBackupTypes from '@rainbow-me/helpers/walletBackupTypes';
import { useDimensions } from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';

export default function RestoreSheet() {
  const { goBack, navigate, setParams } = useNavigation();
  const { height: deviceHeight } = useDimensions();
  const {
    params: {
      longFormHeight = 0,
      step = WalletBackupStepTypes.first,
      userData,
    } = {},
  } = useRoute();

  const onCloudRestore = useCallback(async () => {
    if (Device.isIOS) {
      setParams({ step: WalletBackupStepTypes.cloud });
    }
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

  const wrapperHeight =
    deviceHeight + longFormHeight + (android ? getSoftMenuBarHeight() : 0);

  return (
    <Column height={wrapperHeight}>
      <StatusBar barStyle="light-content" />
      <SlackSheet
        contentHeight={longFormHeight}
        deferredHeight={android}
        testID="restore-sheet"
      >
        {step === WalletBackupStepTypes.cloud ? (
          <RestoreCloudStep userData={userData} />
        ) : (
          <RestoreSheetFirstStep
            enableCloudRestore={enableCloudRestore}
            onCloudRestore={onCloudRestore}
            onManualRestore={onManualRestore}
            walletsBackedUp={walletsBackedUp}
          />
        )}
      </SlackSheet>
    </Column>
  );
}
