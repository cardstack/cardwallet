import { PairingTypes, SessionTypes } from '@walletconnect/types';
import { getSdkError } from '@walletconnect/utils';
import { OptionalUnion } from 'globals';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import WalletConnect from '@cardstack/models/wallet-connect';

export type SessionOrPairing = OptionalUnion<
  SessionTypes.Struct,
  PairingTypes.Struct
>;

const useWalletConnectSessions = () => {
  const [items, setItems] = useState<SessionOrPairing[]>([]);

  const getSessions = useCallback(() => {
    const sessions = WalletConnect.getAcknowledgedSessions() || [];
    const pairings = WalletConnect.getActivePairings() || [];

    setItems([...sessions, ...pairings]);
  }, []);

  useEffect(() => {
    getSessions();
  }, [getSessions]);

  const handleDisconnect = useCallback(
    (topic: string) => () => {
      Alert.alert(`Would you like to disconnect ?`, '', [
        {
          onPress: async () => {
            await WalletConnect.disconnect({
              topic,
              reason: getSdkError('USER_DISCONNECTED'),
            });

            getSessions();
          },
          text: 'Disconnect',
        },
        {
          style: 'cancel',
          text: 'Cancel',
        },
      ]);
    },
    [getSessions]
  );

  return { items, handleDisconnect };
};

export { useWalletConnectSessions };
