import { PairingTypes, SessionTypes } from '@walletconnect/types';
import { OptionalUnion } from 'globals';
import { useEffect, useState } from 'react';

import WalletConnect from '@cardstack/models/wallet-connect';

export type SessionOrPairing = OptionalUnion<
  SessionTypes.Struct,
  PairingTypes.Struct
>;

const useWalletConnectSessions = () => {
  const [items, setItems] = useState<SessionOrPairing[]>([]);

  useEffect(() => {
    const sessions = WalletConnect.getAcknowledgedSessions() || [];
    const pairings = WalletConnect.getActivePairings() || [];

    setItems([...sessions, ...pairings]);
  }, []);

  return { items };
};

export { useWalletConnectSessions };
