import { useRoute } from '@react-navigation/native';
import React, { Fragment, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { cloudPlatform } from '../../../utils/platform';
import { Centered, Column } from '../../layout';
import { Button, Container, Icon, Text } from '@cardstack/components';
import WalletBackupStepTypes from '@rainbow-me/helpers/walletBackupStepTypes';
import { useWallets } from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';
import { padding } from '@rainbow-me/styles';

const Content = styled(Centered).attrs({
  direction: 'column',
})`
  ${padding(0, 19, 42)};
  flex: 1;
`;

export default function NeedsBackupView() {
  const { navigate, setParams } = useNavigation();
  const { params } = useRoute();
  const { wallets, selectedWallet } = useWallets();
  const walletId = params?.walletId || selectedWallet.id;

  useEffect(() => {
    if (wallets[walletId]?.backedUp) {
      setParams({ type: 'AlreadyBackedUpView' });
    }
  }, [setParams, walletId, wallets]);

  const onIcloudBackup = useCallback(() => {
    navigate(ios ? Routes.BACKUP_SHEET : Routes.BACKUP_SCREEN, {
      nativeScreen: true,
      step: WalletBackupStepTypes.cloud,
      walletId,
    });
  }, [navigate, walletId]);

  const onManualBackup = useCallback(() => {
    navigate(ios ? Routes.BACKUP_SHEET : Routes.BACKUP_SCREEN, {
      nativeScreen: true,
      step: WalletBackupStepTypes.manual,
      walletId,
    });
  }, [navigate, walletId]);

  return (
    <Fragment>
      <Container alignItems="center" width="100%">
        <Text color="red" style={{ marginTop: -10 }} variant="subText">
          Not backed up
        </Text>
      </Container>
      <Content>
        <Column align="center">
          <Icon
            color="settingsTeal"
            iconSize="xl"
            marginBottom={2}
            name="upload-cloud"
          />
          <Text fontSize={20} fontWeight="600" marginBottom={2}>
            Back up your account{' '}
          </Text>
          <Text color="blueText" marginBottom={15} textAlign="center">
            Don&apos;t risk your money! Back up your account so you can recover
            it if you lose this device.
          </Text>
        </Column>
        <Container width="100%">
          <Button marginBottom={5} onPress={onIcloudBackup} width="100%">
            {`Back up to ${cloudPlatform}`}
          </Button>
          <Button onPress={onManualBackup} variant="secondary" width="100%">
            Back up manually
          </Button>
        </Container>
      </Content>
    </Fragment>
  );
}
