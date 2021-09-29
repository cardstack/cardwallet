import { useEffect, useState } from 'react';
import { getSDK } from '@cardstack/cardpay-sdk';
import Web3Instance from '@cardstack/models/web3-instance';
import useWallets from '@rainbow-me/hooks/useWallets';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import { Network } from '@rainbow-me/networkTypes';
import { useWorker } from '@cardstack/utils';
import logger from 'logger';

export const useAuthToken = (hubURL?: string) => {
  const [authToken, setAuthToken] = useState<string>('');
  const { selectedWallet } = useWallets();

  const network = useRainbowSelector(
    state => state.settings.network
  ) as Network;

  const { callback: getAuthToken, error, isLoading } = useWorker(async () => {
    const web3 = await Web3Instance.get({ selectedWallet, network });
    const authAPI = await getSDK('HubAuth', web3, hubURL);
    setAuthToken(await authAPI.authenticate());
    const isValid = await authAPI.checkValidAuth(authToken);

    if (!isValid) {
      setAuthToken(await authAPI.authenticate());
    }
  }, [hubURL]);

  useEffect(() => {
    getAuthToken();
  }, [getAuthToken]);

  useEffect(() => {
    if (error) {
      logger.log('Error getting auth token', error);
    }
  }, [error]);

  return { authToken, isLoading };
};
