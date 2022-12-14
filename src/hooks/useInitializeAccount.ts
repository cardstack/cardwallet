import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { dataLoadState } from '../redux/data';
import { walletConnectLoadState } from '../redux/walletconnect';
import useAccountSettings from './useAccountSettings';

import WalletConnect, { signClient } from '@cardstack/models/wallet-connect';
import { collectiblesLoadState } from '@cardstack/redux/collectibles';
import { requestsLoadState } from '@cardstack/redux/requests';
import { mapDispatchToActions } from '@cardstack/utils';
import { imageMetadataCacheLoadState } from '@rainbow-me/redux/imageMetadata';
import { settingsLoadCurrency } from '@rainbow-me/redux/settings';
import logger from 'logger';

export default function useInitializeAccount() {
  const { isOnCardPayNetwork, accountAddress } = useAccountSettings();

  const dispatch = useDispatch();

  useEffect(() => {
    if (accountAddress && !signClient) WalletConnect.init(accountAddress);
  }, [accountAddress]);

  const loadAccountData = useCallback(async () => {
    logger.sentry('Load wallet account data');

    const actions = [
      collectiblesLoadState,
      settingsLoadCurrency,
      imageMetadataCacheLoadState,
      requestsLoadState,
      walletConnectLoadState,
      ...(isOnCardPayNetwork ? [dataLoadState] : []), // Update for cardpay happens on fetchSafes
    ];

    const promises = mapDispatchToActions(dispatch, actions);

    return Promise.allSettled(promises);
  }, [dispatch, isOnCardPayNetwork]);

  return { loadAccountData };
}
