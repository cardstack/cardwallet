import { useEffect, useState } from 'react';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import { Network } from '@rainbow-me/networkTypes';
import { useWorker } from '@cardstack/utils';
import logger from 'logger';
import { useAccountSettings } from '@rainbow-me/hooks';
import { getHubAuthToken, getHubUrl } from '@cardstack/services/hub-service';
import HDProvider from '@cardstack/models/hd-provider';

export const useAuthToken = (seedPhrase?: string) => {
  const [authToken, setAuthToken] = useState<string>('');
  const { accountAddress } = useAccountSettings();

  const network = useRainbowSelector(
    state => state.settings.network
  ) as Network;

  const { callback: getAuthToken, error, isLoading } = useWorker(async () => {
    const hubURLString = getHubUrl(network);

    const authTokenValue = await getHubAuthToken(
      hubURLString,
      network,
      accountAddress,
      seedPhrase
    );

    setAuthToken(authTokenValue || '');

    await HDProvider.reset();
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
