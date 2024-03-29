import { useEffect, useMemo, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { AppStateType } from '@cardstack/types';

import usePrevious from '@rainbow-me/hooks/usePrevious';

export const useAppState = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  const prevAppState = usePrevious(appState);

  useEffect(() => {
    const onChange = (newState: AppStateStatus) => {
      setAppState(newState);
    };

    const subscription = AppState.addEventListener('change', onChange);

    return subscription.remove;
  }, []);

  const justBecameActive = useMemo(
    () =>
      appState === AppStateType.active &&
      prevAppState &&
      prevAppState !== AppStateType.active,
    [appState, prevAppState]
  );

  // Will update to true once the app is resumed from a backgroud state.
  const movedFromBackground = useMemo(
    () => prevAppState === AppStateType.background,
    [prevAppState]
  );

  const isInBackground = useMemo(() => appState === AppStateType.background, [
    appState,
  ]);

  const isActive = useMemo(() => appState === AppStateType.active, [appState]);

  return {
    appState,
    justBecameActive,
    movedFromBackground,
    isInBackground,
    isActive,
  };
};
