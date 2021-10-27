import { useEffect, useState } from 'react';
import { getSDK } from '@cardstack/cardpay-sdk';
import Web3Instance from '@cardstack/models/web3-instance';
import useWallets from '@rainbow-me/hooks/useWallets';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import { Network } from '@rainbow-me/networkTypes';
import { useWorker } from '@cardstack/utils';
import logger from 'logger';
import { useAccountSettings } from '@rainbow-me/hooks';
import HDProvider from '@cardstack/models/hd-provider';

export const useAuthToken = (hubURL: string) => {
  const [authToken, setAuthToken] = useState<string>('');
  const { selectedWallet } = useWallets();
  const { accountAddress } = useAccountSettings();

  const network = useRainbowSelector(
    state => state.settings.network
  ) as Network;

  const { callback: getAuthToken, error, isLoading } = useWorker(async () => {
    const web3 = await Web3Instance.get({ selectedWallet, network });
    const authAPI = await getSDK('HubAuth', web3, hubURL);
    setAuthToken(await authAPI.authenticate({ from: accountAddress }));

    // resets signed provider and web3 instance to kill poller
    await HDProvider.reset();
  }, [hubURL, accountAddress, network]);

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
