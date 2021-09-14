import { useRoute } from '@react-navigation/native';
import React, { Fragment, useCallback, useState } from 'react';
import styled from 'styled-components';

import { Column } from '../layout';
import { SecretDisplaySection } from '../secret-display';
import { CopyToast, ToastPositionContainer } from '../toasts';
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
  const [copiedText, setCopiedText] = useState(undefined);
  const [copyCount, setCopyCount] = useState(0);

  const onComplete = useCallback(() => {
    onManuallyBackupWalletId(walletId);

    goBack();
  }, [goBack, onManuallyBackupWalletId, walletId]);

  const isPrivateKey = type === walletTypes.privateKey;
  const subText = isPrivateKey
    ? 'This is the key to your account!. Copy it and save it in your password manager, or in another secure spot.'
    : 'These words are the keys to your account! Write them down or save them in your password manager.';
  const buttonText = `I've saved ${isPrivateKey ? 'my key' : 'these words'}`;

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
          setCopiedText={setCopiedText}
          setCopyCount={setCopyCount}
        />
      </Content>
      {secretLoaded && (
        <Container paddingHorizontal={5} width="100%">
          <Button marginTop={3} onPress={onComplete} width="100%">
            {buttonText}
          </Button>
        </Container>
      )}
      <ToastPositionContainer>
        <CopyToast copiedText={copiedText} copyCount={copyCount} />
      </ToastPositionContainer>
    </Fragment>
  );
}
