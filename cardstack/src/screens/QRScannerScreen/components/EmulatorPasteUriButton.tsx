import React, { useCallback } from 'react';
import { useIsEmulator } from 'react-native-device-info';
import { Prompt } from '@rainbow-me/components/alerts';
import { ButtonPressAnimation } from '@rainbow-me/components/animations';
import { Icon } from '@cardstack/components';
import { useWalletConnectConnections } from '@rainbow-me/hooks';

export default function EmulatorPasteUriButton() {
  const { result: isEmulator } = useIsEmulator();
  const { walletConnectOnSessionRequest } = useWalletConnectConnections();

  const handlePastedUri = useCallback(
    async uri => walletConnectOnSessionRequest(uri),
    [walletConnectOnSessionRequest]
  );

  const handlePressPasteSessionUri = useCallback(() => {
    Prompt({
      callback: handlePastedUri,
      message: 'Paste WalletConnect URI below',
      title: 'New WalletConnect Session',
      type: 'plain-text',
    });
  }, [handlePastedUri]);

  return isEmulator ? (
    <ButtonPressAnimation onPress={handlePressPasteSessionUri}>
      <Icon
        color="teal"
        iconSize="large"
        marginBottom={2}
        marginRight={8}
        name="link"
      />
    </ButtonPressAnimation>
  ) : null;
}
