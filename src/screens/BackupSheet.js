import { useNavigation, useRoute } from '@react-navigation/native';
import { captureMessage } from '@sentry/react-native';
import lang from 'i18n-js';
import React, { useCallback } from 'react';
import { InteractionManager, StatusBar } from 'react-native';
import { DelayedAlert } from '../components/alerts';
import {
  BackupCloudStep,
  BackupConfirmPasswordStep,
  BackupManualStep,
  BackupSheetSection,
} from '../components/backup';
import { Container, Sheet } from '@cardstack/components';
import { Routes } from '@cardstack/navigation';
import { Device } from '@cardstack/utils/device';
import showWalletErrorAlert from '@rainbow-me/helpers/support';
import WalletBackupStepTypes from '@rainbow-me/helpers/walletBackupStepTypes';
import {
  useRouteExistsInNavigationState,
  useWalletCloudBackup,
  useWallets,
} from '@rainbow-me/hooks';

const { cloudPlatform } = Device;
const onError = error => DelayedAlert({ title: error }, 500);

export default function BackupSheet() {
  const { selectedWallet, isDamaged } = useWallets();
  const { goBack, navigate, setParams } = useNavigation();
  const walletCloudBackup = useWalletCloudBackup();
  const {
    params: {
      missingPassword = null,
      step = WalletBackupStepTypes.first,
      walletId = selectedWallet.id,
    } = {},
  } = useRoute();

  const isSettingsRoute = useRouteExistsInNavigationState(
    Routes.SETTINGS_MODAL
  );

  const handleNoLatestBackup = useCallback(() => {
    setParams({ step: WalletBackupStepTypes.cloud });
  }, [setParams]);

  const handlePasswordNotFound = useCallback(() => {
    setParams({
      missingPassword: true,
      step: WalletBackupStepTypes.cloud,
    });
  }, [setParams]);

  const onSuccess = useCallback(() => {
    goBack();
    if (!isSettingsRoute) {
      DelayedAlert({ title: lang.t('cloud.backup_success') }, 1000);
    }

    // This means the user had the password saved
    // and at least an other wallet already backed up
  }, [goBack, isSettingsRoute]);

  const onCloudBackup = useCallback(() => {
    if (isDamaged) {
      showWalletErrorAlert();
      captureMessage('Damaged account preventing cloud backup');
      goBack();
      return;
    }

    walletCloudBackup({
      handleNoLatestBackup,
      handlePasswordNotFound,
      onError,
      onSuccess,
      walletId,
    });
  }, [
    isDamaged,
    walletCloudBackup,
    handleNoLatestBackup,
    handlePasswordNotFound,
    onSuccess,
    walletId,
    goBack,
  ]);

  const onManualBackup = useCallback(() => {
    setParams({ step: WalletBackupStepTypes.manual });
  }, [setParams]);

  const onBackupNow = useCallback(async () => {
    goBack();
    InteractionManager.runAfterInteractions(() => {
      navigate(Routes.SETTINGS_MODAL, {
        initialRoute: 'BackupSection',
      });
    });
  }, [goBack, navigate]);

  const renderStep = useCallback(() => {
    switch (step) {
      case WalletBackupStepTypes.existing_user:
        return (
          <BackupSheetSection
            descriptionText={`Save an encrypted copy of your account, so you can restore it from ${cloudPlatform} at any time.`}
            onPrimaryAction={onBackupNow}
            onSecondaryAction={goBack}
            primaryLabel="Back up"
            secondaryLabel="Not now"
            titleText="Ready to back it up?"
            type="Existing User"
          />
        );
      case WalletBackupStepTypes.imported:
        return (
          <BackupSheetSection
            descriptionText={`Don't lose your account! Save an encrypted copy to ${cloudPlatform}.`}
            onPrimaryAction={onCloudBackup}
            onSecondaryAction={goBack}
            primaryLabel={`Back up to ${cloudPlatform}`}
            secondaryButtonTestId="backup-sheet-imported-cancel-button"
            secondaryLabel="No thanks"
            titleText="Would you like to back up?"
            type="Imported Wallet"
          />
        );
      case WalletBackupStepTypes.cloud:
        return missingPassword ? (
          <BackupConfirmPasswordStep />
        ) : (
          <BackupCloudStep />
        );
      case WalletBackupStepTypes.manual:
        return <BackupManualStep />;
      default:
        return (
          <BackupSheetSection
            descriptionText={`Don't lose your account! Save an encrypted copy to ${cloudPlatform}.`}
            onPrimaryAction={onCloudBackup}
            onSecondaryAction={onManualBackup}
            primaryLabel={`Back up to ${cloudPlatform}`}
            secondaryLabel="Back up manually"
            titleText="Back up your account"
            type="Default"
          />
        );
    }
  }, [
    goBack,
    missingPassword,
    onBackupNow,
    onCloudBackup,
    onManualBackup,
    step,
  ]);

  const isFullScreenStep = useMemo(
    () =>
      [WalletBackupStepTypes.manual, WalletBackupStepTypes.cloud].includes(
        step
      ),
    [step]
  );

  return (
    <Container flex={1} testID="backup-sheet">
      <StatusBar barStyle="light-content" />
      <Sheet
        isFullScreen={isFullScreenStep}
        overlayColor="transparent"
        scrollEnabled={isFullScreenStep}
      >
        {renderStep()}
      </Sheet>
    </Container>
  );
}
