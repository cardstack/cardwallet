import { captureException } from '@sentry/react-native';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { collectiblesRefreshState } from '@cardstack/redux/collectibles';
import { fallbackExplorerInit } from '@rainbow-me/redux/fallbackExplorer';
import logger from 'logger';

export default function useInitializeAccountData() {
  const dispatch = useDispatch();

  const initializeAccountData = useCallback(async () => {
    try {
      const fetchMainAssets = dispatch(fallbackExplorerInit());
      const fetchCollectibles = dispatch(collectiblesRefreshState());

      await Promise.all([fetchMainAssets, fetchCollectibles]);
      logger.sentry('Initialize account data and collectibles ');
    } catch (error) {
      logger.sentry('Error initializing account data', error);
      captureException(error);
    }
  }, [dispatch]);

  return initializeAccountData;
}
