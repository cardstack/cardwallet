import { captureException } from '@sentry/react-native';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { dataLoadState } from '../redux/data';
import { walletConnectLoadState } from '../redux/walletconnect';
import useAccountSettings from './useAccountSettings';
import WalletConnect from '@cardstack/models/wallet-connect';
import {
  collectiblesLoadState,
  collectiblesRefreshState,
} from '@cardstack/redux/collectibles';
import { requestsLoadState } from '@cardstack/redux/requests';
import { fallbackExplorerInit } from '@rainbow-me/redux/fallbackExplorer';
import { mapDispatchToActions } from '@rainbow-me/redux/hooks';
import { imageMetadataCacheLoadState } from '@rainbow-me/redux/imageMetadata';
import { settingsLoadCurrency } from '@rainbow-me/redux/settings';
import logger from 'logger';

export default function useInitializeAccount() {
  const { isOnCardPayNetwork, accountAddress } = useAccountSettings();

  const dispatch = useDispatch();

  const loadAccountData = useCallback(async () => {
    logger.sentry('Load wallet account data');

    await WalletConnect.init(accountAddress);

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
  }, [accountAddress, dispatch, isOnCardPayNetwork]);

  const fetchAccountAssets = useCallback(async () => {
    try {
      await Promise.all(
        mapDispatchToActions(dispatch, [
          fallbackExplorerInit,
          collectiblesRefreshState,
        ])
      );
      logger.sentry('Initialize account data and collectibles ');
    } catch (error) {
      logger.sentry('Error initializing account data');
      captureException(error);
    }
  }, [dispatch]);

  return { loadAccountData, fetchAccountAssets };
}
