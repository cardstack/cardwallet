import { captureException } from '@sentry/react-native';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { uniqueTokensRefreshState } from '../redux/uniqueTokens';
import { fetchWalletNames } from '../redux/wallets';
import { fetchAssetsBalancesAndPrices } from '@rainbow-me/redux/fallbackExplorer';
import logger from 'logger';

export default function useRefreshAccountData() {
  const dispatch = useDispatch();

  const refreshAccountData = useCallback(async () => {
    try {
      const getWalletNames = dispatch(fetchWalletNames());
      const getUniqueTokens = dispatch(uniqueTokensRefreshState());

      return Promise.all([
        getWalletNames,
        getUniqueTokens,
        fetchAssetsBalancesAndPrices(),
      ]);
    } catch (error) {
      logger.log('Error refreshing data', error);
      captureException(error);
      throw error;
    }
  }, [dispatch]);

  return refreshAccountData;
}
