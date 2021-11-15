import { captureException } from '@sentry/react-native';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { collectiblesRefreshState } from '../redux/collectibles';
import { fetchWalletNames } from '../redux/wallets';
import { fetchAssetsBalancesAndPrices } from '@rainbow-me/redux/fallbackExplorer';
import logger from 'logger';

export default function useRefreshAccountData() {
  const dispatch = useDispatch();

  const refreshAccountData = useCallback(async () => {
    try {
      const getWalletNames = dispatch(fetchWalletNames());
      const fetchCollectibles = dispatch(collectiblesRefreshState());

      return Promise.all([
        getWalletNames,
        fetchCollectibles,
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
