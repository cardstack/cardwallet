import { useEffect } from 'react';

import { useLocalAuth } from '@cardstack/hooks/useLocalAuth';

import useAppState from '@rainbow-me/hooks/useAppState';

export const AppStateUpdate = () => {
  const { appState } = useAppState();
  const { revoke } = useLocalAuth();

  useEffect(() => {
    if (appState === 'background') {
      revoke();
    }
  }, [appState, revoke]);

  return null;
};
