import { captureException } from '@sentry/react-native';
import delay from 'delay';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { uniqueTokensRefreshState } from '../redux/uniqueTokens';
import { fetchWalletNames } from '../redux/wallets';
import {
  fallbackExplorerClearState,
  fallbackExplorerInit,
} from '@rainbow-me/redux/fallbackExplorer';
import logger from 'logger';

export default function useRefreshAccountData() {
  const dispatch = useDispatch();

  const refreshAccountData = useCallback(async () => {
    try {
      await dispatch(fallbackExplorerClearState());
      const getWalletNames = dispatch(fetchWalletNames());
      const getUniqueTokens = dispatch(uniqueTokensRefreshState());
      const explorer = dispatch(fallbackExplorerInit());

      return Promise.all([
        explorer,
        getWalletNames,
        getUniqueTokens,
        // We will remove this and track the loading based on fallbackExplorer
        // This is a workaround to have the animation while updating the assets
        delay(12000), // minimum duration we want the "Pull to Refresh" animation to last
      ]);
    } catch (error) {
      logger.log('Error refreshing data', error);
      captureException(error);
      throw error;
    }
  }, [dispatch]);

  return refreshAccountData;
}
