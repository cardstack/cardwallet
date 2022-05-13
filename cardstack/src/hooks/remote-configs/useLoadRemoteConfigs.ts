import { useEffect, useCallback } from 'react';

import { useBooleanState } from '@cardstack/hooks';
import { loadRemoteConfigs } from '@cardstack/services/remote-config';

import logger from 'logger';

export const useLoadRemoteConfigs = () => {
  const [isReady, setIsReady] = useBooleanState();

  const initRemoteConfigs = useCallback(async () => {
    try {
      await loadRemoteConfigs();
    } catch (error) {
      logger.sentry("Couldn't fetch remote config", error);
    } finally {
      setIsReady();
    }
  }, [setIsReady]);

  useEffect(() => {
    initRemoteConfigs();
  }, [initRemoteConfigs]);

  return {
    isReady,
  };
};
