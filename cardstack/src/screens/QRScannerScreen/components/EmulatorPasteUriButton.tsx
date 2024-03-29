import React, { useCallback } from 'react';
import { useIsEmulator } from 'react-native-device-info';

import { Icon } from '@cardstack/components';

import { Prompt } from '@rainbow-me/components/alerts';
import { useWalletConnectConnections } from '@rainbow-me/hooks';

export function EmulatorPasteUriButton() {
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
    <Icon
      color="teal"
      iconSize="medium"
      name="link"
      onPress={handlePressPasteSessionUri}
    />
  ) : null;
}
