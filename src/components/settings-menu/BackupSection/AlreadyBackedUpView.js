import { useRoute } from '@react-navigation/native';
import analytics from '@segment/analytics-react-native';
import React, { Fragment, useCallback, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { useTheme } from '../../../context/ThemeContext';
import { deleteAllBackups } from '../../../handlers/cloudBackup';
import { walletsUpdate } from '../../../redux/wallets';
import { cloudPlatform } from '../../../utils/platform';
import { DelayedAlert } from '../../alerts';
import { ButtonPressAnimation } from '../../animations';
import { Centered } from '../../layout';
import { Button, Container, Icon, Text } from '@cardstack/components';
import WalletBackupStepTypes from '@rainbow-me/helpers/walletBackupStepTypes';
import WalletBackupTypes from '@rainbow-me/helpers/walletBackupTypes';
import WalletTypes from '@rainbow-me/helpers/walletTypes';
import { useWalletCloudBackup, useWallets } from '@rainbow-me/hooks';
import { Navigation, useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';
import { padding } from '@rainbow-me/styles';
import { showActionSheetWithOptions } from '@rainbow-me/utils';

const WalletBackupStatus = {
  CLOUD_BACKUP: 0,
  IMPORTED: 1,
  MANUAL_BACKUP: 2,
};

const Content = styled(Centered).attrs({
  direction: 'column',
})`
  ${padding(0, 19, 30)};
  flex: 1;
`;

const Footer = styled(Centered)`
  ${padding(0, 15, 42)};
`;

const onError = error => DelayedAlert({ title: error }, 500);

export default function AlreadyBackedUpView() {
  const { navigate } = useNavigation();
  const { params } = useRoute();
  const dispatch = useDispatch();
  const { wallets, selectedWallet } = useWallets();
  const walletCloudBackup = useWalletCloudBackup();
  const walletId = params?.walletId || selectedWallet.id;

  useEffect(() => {
    analytics.track('Already Backed Up View', {
      category: 'settings backup',
    });
  }, []);

  const walletStatus = useMemo(() => {
    let status = null;
    if (wallets[walletId].backedUp) {
      if (wallets[walletId].backupType === WalletBackupTypes.manual) {
        status = WalletBackupStatus.MANUAL_BACKUP;
      } else {
        status = WalletBackupStatus.CLOUD_BACKUP;
      }
    } else {
      status = WalletBackupStatus.IMPORTED;
    }
    return status;
  }, [walletId, wallets]);

  const handleNoLatestBackup = useCallback(() => {
    Navigation.handleAction(
      android ? Routes.BACKUP_SCREEN : Routes.BACKUP_SHEET,
      {
        nativeScreen: android,
        step: WalletBackupStepTypes.cloud,
        walletId,
      }
    );
  }, [walletId]);

  const handlePasswordNotFound = useCallback(() => {
    Navigation.handleAction(
      android ? Routes.BACKUP_SCREEN : Routes.BACKUP_SHEET,
      {
        missingPassword: true,
        nativeScreen: android,
        step: WalletBackupStepTypes.cloud,
        walletId,
      }
    );
  }, [walletId]);

  const manageCloudBackups = useCallback(() => {
    const buttons = [`Delete All ${cloudPlatform} Backups`, 'Cancel'];

    showActionSheetWithOptions(
      {
        cancelButtonIndex: 1,
        destructiveButtonIndex: 0,
        options: buttons,
        title: `Manage ${cloudPlatform} Backups`,
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          // Delete wallet with confirmation
          showActionSheetWithOptions(
            {
              cancelButtonIndex: 1,
              destructiveButtonIndex: 0,
              message: `Are you sure you want to delete your ${cloudPlatform} wallet backups?`,
              options: [`Confirm and Delete Backups`, 'Cancel'],
            },
            async buttonIndex => {
              if (buttonIndex === 0) {
                const newWallets = { ...wallets };
                Object.keys(newWallets).forEach(key => {
                  newWallets[key].backedUp = undefined;
                  newWallets[key].backupDate = undefined;
                  newWallets[key].backupFile = undefined;
                  newWallets[key].backupType = undefined;
                });

                await dispatch(walletsUpdate(newWallets));

                // Delete all backups (debugging)
                await deleteAllBackups();

                Alert.alert('Backups deleted succesfully');
              }
            }
          );
        }
      }
    );
  }, [dispatch, wallets]);

  const handleIcloudBackup = useCallback(() => {
    if (
      ![WalletBackupStatus.MANUAL_BACKUP, WalletBackupStatus.IMPORTED].includes(
        walletStatus
      )
    ) {
      return;
    }

    analytics.track(`Back up to ${cloudPlatform} pressed`, {
      category: 'settings backup',
    });

    walletCloudBackup({
      handleNoLatestBackup,
      handlePasswordNotFound,
      onError,
      walletId,
    });
  }, [
    handleNoLatestBackup,
    handlePasswordNotFound,
    walletCloudBackup,
    walletId,
    walletStatus,
  ]);

  const handleViewRecoveryPhrase = useCallback(() => {
    navigate('ShowSecretView', {
      title: `Recovery ${
        WalletTypes.mnemonic === wallets[walletId].type ? 'Phrase' : 'Key'
      }`,
      walletId,
    });
  }, [navigate, walletId, wallets]);

  const hasMultipleWallets =
    Object.keys(wallets).filter(
      key => wallets[key].type !== WalletTypes.readOnly
    ).length > 1;

  return (
    <Fragment>
      <Container alignItems="center" width="100%">
        <Text style={{ marginTop: -10 }} variant="subText">
          {(walletStatus === WalletBackupStatus.CLOUD_BACKUP && `Backed up`) ||
            (walletStatus === WalletBackupStatus.MANUAL_BACKUP &&
              `Backed up manually`) ||
            (walletStatus === WalletBackupStatus.IMPORTED && `Imported`)}
        </Text>
      </Container>
      <Content>
        <Centered direction="column">
          <Icon iconSize="xl" marginBottom={4} name="success" />
          <Text fontSize={20} fontWeight="600" marginBottom={1}>
            {(walletStatus === WalletBackupStatus.IMPORTED &&
              `Your account was imported`) ||
              `Your account is backed up`}
          </Text>
          <Text color="blueText" marginBottom={8} textAlign="center">
            {(walletStatus === WalletBackupStatus.CLOUD_BACKUP &&
              `If you lose this device, you can recover your encrypted wallet backup from ${cloudPlatform}.`) ||
              (walletStatus === WalletBackupStatus.MANUAL_BACKUP &&
                `If you lose this device, you can restore your wallet with the recovery phrase you saved.`) ||
              (walletStatus === WalletBackupStatus.IMPORTED &&
                `If you lose this device, you can restore your wallet with the key you originally imported.`)}
          </Text>
        </Centered>
        <Container>
          <Button onPress={handleViewRecoveryPhrase} width="100%">
            View Recovery Phrase
          </Button>
        </Container>
      </Content>
      {walletStatus !== WalletBackupStatus.CLOUD_BACKUP ? (
        <Footer>
          <ButtonPressAnimation onPress={handleIcloudBackup}>
            <Text>Back up to {cloudPlatform}</Text>
          </ButtonPressAnimation>
        </Footer>
      ) : !hasMultipleWallets ? (
        <Footer>
          <ButtonPressAnimation onPress={manageCloudBackups}>
            <Text>Manage {cloudPlatform} Backups</Text>
          </ButtonPressAnimation>
        </Footer>
      ) : null}
    </Fragment>
  );
}
