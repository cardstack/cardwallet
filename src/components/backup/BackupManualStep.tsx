import { useNavigation } from '@react-navigation/native';
import React, { Fragment, useCallback, useMemo, useState } from 'react';

import { SecretDisplaySection } from '../secret-display';
import {
  Button,
  CenteredContainer,
  Container,
  Icon,
  Text,
} from '@cardstack/components';
import { useWalletManualBackup } from '@cardstack/hooks/backup/useWalletManualBackup';
import { Device } from '@cardstack/utils/device';
import walletTypes from '@rainbow-me/helpers/walletTypes';
import { useDimensions } from '@rainbow-me/hooks';

export default function BackupManualStep() {
  const { isTallPhone } = useDimensions();
  const { goBack } = useNavigation();
  const { confirmBackup } = useWalletManualBackup();

  const [type, setType] = useState(null);
  const [secretLoaded, setSecretLoaded] = useState(false);

  const onComplete = useCallback(() => {
    confirmBackup();

    goBack();
  }, [goBack, confirmBackup]);

  const isPrivateKey = type === walletTypes.privateKey;
  const subText = isPrivateKey
    ? 'This is the key to your account!. Copy it and save it in your password manager, or in another secure spot.'
    : 'These words are the keys to your account! Write them down or save them in your password manager.';
  const buttonText = `I've saved ${isPrivateKey ? 'my key' : 'these words'}`;

  const style = useMemo(
    () => ({
      paddingTop: Device.isAndroid ? 30 : isTallPhone ? 65 : 15,
    }),
    [isTallPhone]
  );

  return (
    <Fragment>
      <Container alignItems="center" marginTop={5} paddingHorizontal={10}>
        <Icon color="settingsGrayDark" name="file-text" size={35} />
        <Text marginTop={2} size="medium" weight="bold">
          Manual Backup
        </Text>
        <Text color="blueText" marginTop={2} textAlign="center">
          {subText}
        </Text>
      </Container>
      <CenteredContainer justifyContent="flex-start" style={style}>
        <SecretDisplaySection
          onSecretLoaded={setSecretLoaded}
          onWalletTypeIdentified={setType}
        />
      </CenteredContainer>
      {secretLoaded && (
        <Container flex={1} paddingHorizontal={5} width="100%">
          <Button marginTop={3} onPress={onComplete} width="100%">
            {buttonText}
          </Button>
        </Container>
      )}
    </Fragment>
  );
}
