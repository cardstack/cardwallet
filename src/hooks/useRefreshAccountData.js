import { captureException } from '@sentry/react-native';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { collectiblesRefreshState } from '@cardstack/redux/collectibles';
import { fallbackExplorerInit } from '@rainbow-me/redux/fallbackExplorer';
import logger from 'logger';

export default function useRefreshAccountData() {
  const dispatch = useDispatch();

  const refreshAccountData = useCallback(async () => {
    try {
      const fetchCollectibles = dispatch(collectiblesRefreshState());
      const updateAssetBalances = dispatch(fallbackExplorerInit());
      return Promise.all([fetchCollectibles, updateAssetBalances]);
    } catch (error) {
      logger.log('Error refreshing data', error);
      captureException(error);
      throw error;
    }
  }, [dispatch]);

  return refreshAccountData;
}
