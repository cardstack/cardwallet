import { useRoute } from '@react-navigation/native';
import analytics from '@segment/analytics-react-native';
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
import { SlackSheet } from '../components/sheet';
import { cloudPlatform } from '../utils/platform';
import { Container } from '@cardstack/components';
import showWalletErrorAlert from '@rainbow-me/helpers/support';
import WalletBackupStepTypes from '@rainbow-me/helpers/walletBackupStepTypes';
import {
  useDimensions,
  useRouteExistsInNavigationState,
  useWalletCloudBackup,
  useWallets,
} from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';

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
    if (android) {
      goBack();
      navigate(Routes.BACKUP_SCREEN, {
        nativeScreen: true,
        step: WalletBackupStepTypes.cloud,
      });
    } else {
      setParams({ step: WalletBackupStepTypes.cloud });
    }
  }, [goBack, navigate, setParams]);

  const handlePasswordNotFound = useCallback(() => {
    if (android) {
      goBack();
      navigate(Routes.BACKUP_SCREEN, {
        missingPassword: true,
        nativeScreen: true,
        step: WalletBackupStepTypes.cloud,
      });
    } else {
      setParams({
        missingPassword: true,
        step: WalletBackupStepTypes.cloud,
      });
    }
  }, [goBack, navigate, setParams]);

  const onSuccess = useCallback(() => {
    goBack();
    if (!isSettingsRoute) {
      DelayedAlert({ title: lang.t('cloud.backup_success') }, 1000);
    }

    // This means the user had the password saved
    // and at least an other wallet already backed up
    analytics.track('Backup Complete via BackupSheet', {
      category: 'backup',
      label: cloudPlatform,
    });
  }, [goBack, isSettingsRoute]);

  const onIcloudBackup = useCallback(() => {
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
    if (android) {
      goBack();
      navigate(Routes.BACKUP_SCREEN, {
        nativeScreen: true,
        step: WalletBackupStepTypes.manual,
      });
    } else {
      setParams({ step: WalletBackupStepTypes.manual });
    }
  }, [goBack, navigate, setParams]);

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
            descriptionText="Save an encrypted copy of your account, so you can restore it from iCloud at any time."
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
            onPrimaryAction={onIcloudBackup}
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
            onPrimaryAction={onIcloudBackup}
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
    onIcloudBackup,
    onManualBackup,
    step,
  ]);

  return (
    <Container flex={1} testID="backup-sheet">
      <StatusBar barStyle="light-content" />
      <SlackSheet flex={1}>{renderStep()}</SlackSheet>
    </Container>
  );
}
