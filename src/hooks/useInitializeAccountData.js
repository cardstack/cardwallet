import { captureException } from '@sentry/react-native';
import { useCallback } from 'react';
import { InteractionManager } from 'react-native';
import { useDispatch } from 'react-redux';
import { uniswapGetAllExchanges, uniswapPairsInit } from '../redux/uniswap';
import { collectiblesRefreshState } from '@cardstack/redux/collectibles';
import {
  fallbackExplorerClearState,
  fallbackExplorerInit,
} from '@rainbow-me/redux/fallbackExplorer';
import logger from 'logger';

export default function useInitializeAccountData() {
  const dispatch = useDispatch();

  const initializeAccountData = useCallback(async () => {
    try {
      InteractionManager.runAfterInteractions(async () => {
        logger.sentry('Initialize account data');
        await dispatch(fallbackExplorerClearState());
        await dispatch(fallbackExplorerInit());
      });

      InteractionManager.runAfterInteractions(async () => {
        logger.sentry('Initialize uniswapPairsInit & getAllExchanges');
        dispatch(uniswapPairsInit());
        await dispatch(uniswapGetAllExchanges());
      });

      InteractionManager.runAfterInteractions(async () => {
        logger.sentry('Initialize collectibles');
        await dispatch(collectiblesRefreshState());
      });
    } catch (error) {
      logger.sentry('Error initializing account data');
      captureException(error);
    }
  }, [dispatch]);

  return initializeAccountData;
}
