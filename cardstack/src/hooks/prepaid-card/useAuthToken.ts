import { useEffect, useState } from 'react';

import { getHubAuthToken, getHubUrl } from '@cardstack/services/hub-service';
import { useWorker } from '@cardstack/utils';

import { useAccountSettings } from '@rainbow-me/hooks';
import logger from 'logger';

export const useAuthToken = () => {
  const [authToken, setAuthToken] = useState<string>('');
  const { accountAddress, network } = useAccountSettings();

  const { callback: getAuthToken, error, isLoading } = useWorker(async () => {
    const hubURLString = getHubUrl(network);

    const authTokenValue = await getHubAuthToken(
      hubURLString,
      network,
      accountAddress
    );

    setAuthToken(authTokenValue || '');
  }, [accountAddress, network]);

  useEffect(() => {
    getAuthToken();
  }, [getAuthToken]);

  useEffect(() => {
    if (error) {
      logger.log('Error getting auth token', error);
    }
  }, [error]);

  return { authToken, isLoading, error };
};
