import { useNavigation, useRoute } from '@react-navigation/native';
import React, { Fragment, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { DelayedAlert } from '../../alerts';
import { ButtonPressAnimation } from '../../animations';
import { Centered } from '../../layout';
import {
  Button,
  CenteredContainer,
  Container,
  Icon,
  Text,
} from '@cardstack/components';
import { Navigation, Routes } from '@cardstack/navigation';
import { Device } from '@cardstack/utils/device';
import WalletBackupStepTypes from '@rainbow-me/helpers/walletBackupStepTypes';
import WalletBackupTypes from '@rainbow-me/helpers/walletBackupTypes';
import WalletTypes from '@rainbow-me/helpers/walletTypes';
import {
  useDimensions,
  useManageCloudBackups,
  useWalletCloudBackup,
  useWallets,
} from '@rainbow-me/hooks';
import { padding } from '@rainbow-me/styles';

const WalletBackupStatus = {
  CLOUD_BACKUP: 0,
  IMPORTED: 1,
  MANUAL_BACKUP: 2,
};
const { cloudPlatform } = Device;

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
  const { manageCloudBackups } = useManageCloudBackups();
  const { wallets, selectedWallet } = useWallets();
  const { isSmallPhone } = useDimensions();
  const walletCloudBackup = useWalletCloudBackup();
  const walletId = params?.walletId || selectedWallet.id;

  const walletStatus = useMemo(() => {
    let status = null;
    const wallet = wallets[walletId];

    if (wallet.manuallyBackedUp) {
      status = WalletBackupStatus.MANUAL_BACKUP;
    } else if (
      wallet.backedUp &&
      wallet.backupType === WalletBackupTypes.cloud
    ) {
      status = WalletBackupStatus.CLOUD_BACKUP;
    } else {
      status = WalletBackupStatus.IMPORTED;
    }
    return status;
  }, [walletId, wallets]);

  const handleNoLatestBackup = useCallback(() => {
    Navigation.handleAction(Routes.BACKUP_SHEET, {
      step: WalletBackupStepTypes.cloud,
      walletId,
    });
  }, [walletId]);

  const handlePasswordNotFound = useCallback(() => {
    Navigation.handleAction(Routes.BACKUP_SHEET, {
      missingPassword: true,
      step: WalletBackupStepTypes.cloud,
      walletId,
    });
  }, [walletId]);

  const handleIcloudBackup = useCallback(() => {
    if (
      ![WalletBackupStatus.MANUAL_BACKUP, WalletBackupStatus.IMPORTED].includes(
        walletStatus
      )
    ) {
      return;
    }

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
      title: `${isSmallPhone ? 'Recovery' : 'Secret Recovery'} ${
        WalletTypes.mnemonic === wallets[walletId].type ? 'Phrase' : 'Key'
      }`,
      walletId,
    });
  }, [navigate, walletId, wallets, isSmallPhone]);

  const hasMultipleWallets =
    Object.keys(wallets).filter(
      key => wallets[key].type !== WalletTypes.readOnly
    ).length > 1;

  return (
    <Fragment>
      <Container alignItems="center" width="100%">
        <Text paddingTop={1} variant="subText">
          {(walletStatus === WalletBackupStatus.CLOUD_BACKUP && `Backed up`) ||
            (walletStatus === WalletBackupStatus.MANUAL_BACKUP &&
              `Backed up manually`) ||
            (walletStatus === WalletBackupStatus.IMPORTED && `Imported`)}
        </Text>
      </Container>
      <Content>
        <Centered direction="column">
          <Icon iconSize="xl" marginBottom={4} name="success" />
          <Text fontSize={20} marginBottom={1} weight="bold">
            {(walletStatus === WalletBackupStatus.IMPORTED &&
              `Your account was imported`) ||
              `Your account is backed up`}
          </Text>
          <Text color="blueText" textAlign="center">
            {(walletStatus === WalletBackupStatus.CLOUD_BACKUP &&
              `If you lose this device, you can recover your encrypted account backup from ${cloudPlatform}.`) ||
              (walletStatus === WalletBackupStatus.MANUAL_BACKUP &&
                `If you lose this device, you can restore your account with the secret recovery phrase you saved.`) ||
              (walletStatus === WalletBackupStatus.IMPORTED &&
                `If you lose this device, you can restore your account with the key you originally imported.`)}
          </Text>
        </Centered>
        <Container marginTop={8} width="100%">
          <Button onPress={handleViewRecoveryPhrase} width="100%">
            View Secret Recovery Phrase
          </Button>
        </Container>
      </Content>
      {walletStatus !== WalletBackupStatus.CLOUD_BACKUP ? (
        <Footer>
          {Device.enableBackup && (
            <ButtonPressAnimation onPress={handleIcloudBackup}>
              <CenteredContainer flexDirection="row">
                <Icon
                  color="settingsTeal"
                  iconSize="medium"
                  marginRight={2}
                  name="download-cloud"
                />
                <Text color="settingsTeal" weight="bold">
                  Back up to {cloudPlatform}
                </Text>
              </CenteredContainer>
            </ButtonPressAnimation>
          )}
        </Footer>
      ) : !hasMultipleWallets ? (
        <Footer>
          <ButtonPressAnimation onPress={manageCloudBackups}>
            <Text color="settingsTeal" weight="bold">
              Manage {cloudPlatform} Backups
            </Text>
          </ButtonPressAnimation>
        </Footer>
      ) : null}
    </Fragment>
  );
}
