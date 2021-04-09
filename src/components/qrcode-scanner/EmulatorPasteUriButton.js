import React, { useCallback } from 'react';
import { useIsEmulator } from 'react-native-device-info';
import { Prompt } from '../alerts';
import { Icon, Touchable } from '@cardstack/components';
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
    <Touchable onPress={handlePressPasteSessionUri}>
      <Icon
        color="blue"
        iconSize="large"
        marginBottom={2}
        marginRight={8}
        name="link"
        onPress={handlePressPasteSessionUri}
      />
    </Touchable>
  ) : null;
}
