import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  initRemoteConfigsThunk,
  forceFetchRemoteConfigsThunk,
} from '@cardstack/redux/remoteConfigSlice';

import { AppState } from '@rainbow-me/redux/store';

export const useRemoteConfigs = () => {
  const dispatch = useDispatch();

  const { configs, isReady, isInitializing } = useSelector(
    (state: AppState) => state.remoteConfigSlice
  );

  const initRemoteConfigs = useCallback(
    () => dispatch(initRemoteConfigsThunk()),
    [dispatch]
  );

  const fetchRemoteConfigs = useCallback(
    () => dispatch(forceFetchRemoteConfigsThunk()),
    [dispatch]
  );

  useEffect(() => {
    if (!isReady && !isInitializing) initRemoteConfigs();
  }, [isReady, isInitializing, initRemoteConfigs]);

  return {
    isReady,
    configs,
    fetchRemoteConfigs,
  };
};
