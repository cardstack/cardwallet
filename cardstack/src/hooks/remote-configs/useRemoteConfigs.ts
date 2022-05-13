import remoteConfig from '@react-native-firebase/remote-config';
import { useEffect, useCallback } from 'react';

import { useBooleanState } from '@cardstack/hooks';
import { fetchRemoteConfigs } from '@cardstack/services/remote-config';

import logger from 'logger';

export const useRemoteConfigs = () => {
  const [isReady, setIsReady] = useBooleanState();

  const initRemoteConfigs = useCallback(async () => {
    try {
      await fetchRemoteConfigs();
    } catch (error) {
      logger.sentry("Couldn't fetch remote config", error);
    } finally {
      console.log(remoteConfig().getAll());
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
