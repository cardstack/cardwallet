import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useBooleanState } from '@cardstack/hooks';
import {
  initRemoteConfigsThunk,
  forceFetchRemoteConfigsThunk,
} from '@cardstack/redux/remoteConfigSlice';

import { AppState } from '@rainbow-me/redux/store';
import logger from 'logger';

export const useRemoteConfigs = () => {
  const dispatch = useDispatch();
  const configs = useSelector((state: AppState) => state.remoteConfigSlice);
  const [isReady, setIsReady] = useBooleanState();

  const initRemoteConfigs = useCallback(async () => {
    try {
      dispatch(initRemoteConfigsThunk());
    } catch (error) {
      logger.sentry("Couldn't fetch remote config", error);
    } finally {
      setIsReady();
    }
  }, [setIsReady, dispatch]);

  const fetchRemoteConfigs = useCallback(
    () => dispatch(forceFetchRemoteConfigsThunk()),
    [dispatch]
  );

  useEffect(() => {
    initRemoteConfigs();
  }, [initRemoteConfigs]);

  return {
    isReady,
    configs,
    fetchRemoteConfigs,
  };
};
