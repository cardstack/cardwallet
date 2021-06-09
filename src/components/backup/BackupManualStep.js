import { useRoute } from '@react-navigation/native';
import analytics from '@segment/analytics-react-native';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { useTheme } from '../../context/ThemeContext';
import { Column } from '../layout';
import { SecretDisplaySection } from '../secret-display';
import { Button, Container, Icon, Text } from '@cardstack/components';
import walletTypes from '@rainbow-me/helpers/walletTypes';
import {
  useDimensions,
  useWalletManualBackup,
  useWallets,
} from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';

const Content = styled(Column).attrs({
  align: 'center',
  justify: 'start',
})`
  flex-grow: 1;
  flex-shrink: 0;
  padding-top: ${({ isTallPhone }) => (android ? 30 : isTallPhone ? 65 : 15)};
`;

export default function BackupManualStep() {
  const { isTallPhone } = useDimensions();
  const { goBack } = useNavigation();
  const { selectedWallet } = useWallets();
  const { onManuallyBackupWalletId } = useWalletManualBackup();
  const { params } = useRoute();
  const walletId = params?.walletId || selectedWallet.id;

  const [type, setType] = useState(null);
  const [secretLoaded, setSecretLoaded] = useState(false);

  const onComplete = useCallback(() => {
    onManuallyBackupWalletId(walletId);
    analytics.track('Backup Complete', {
      category: 'backup',
      label: 'manual',
    });
    goBack();
  }, [goBack, onManuallyBackupWalletId, walletId]);

  useEffect(() => {
    analytics.track('Manual Backup Step', {
      category: 'backup',
      label: 'manual',
    });
  }, []);

  const subText =
    type === walletTypes.privateKey
      ? 'This is the key to your wallet!. Copy it and save it in your password manager, or in another secure spot.'
      : 'These words are the keys to your wallet! Write them down or save them in your password manager.';

  return (
    <Fragment>
      <Container alignItems="center" marginTop={5} paddingHorizontal={10}>
        <Icon color="settingsGray" name="file-text" size={35} />
        <Text marginTop={2} size="medium" weight="bold">
          Manual Backup
        </Text>
        <Text color="blueText" marginTop={2} textAlign="center">
          {subText}
        </Text>
      </Container>
      <Content isTallPhone={isTallPhone}>
        <SecretDisplaySection
          onSecretLoaded={setSecretLoaded}
          onWalletTypeIdentified={setType}
        />
      </Content>
      {secretLoaded && (
        <Container paddingHorizontal={5} width="100%">
          <Button marginTop={3} onPress={onComplete} width="100%">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            I've saved these words
          </Button>
        </Container>
      )}
    </Fragment>
  );
}
