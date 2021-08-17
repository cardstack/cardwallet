import { captureException } from '@sentry/react-native';
import delay from 'delay';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { uniqueTokensRefreshState } from '../redux/uniqueTokens';
import { uniswapUpdateLiquidityState } from '../redux/uniswapLiquidity';
import { fetchWalletNames } from '../redux/wallets';
import useSavingsAccount from './useSavingsAccount';
import { fallbackExplorerInit } from '@rainbow-me/redux/fallbackExplorer';
import logger from 'logger';

export default function useRefreshAccountData() {
  const dispatch = useDispatch();
  const { refetchSavings } = useSavingsAccount();

  const refreshAccountData = useCallback(async () => {
    try {
      const getWalletNames = dispatch(fetchWalletNames());
      const getUniswapLiquidity = dispatch(uniswapUpdateLiquidityState());
      const getUniqueTokens = dispatch(uniqueTokensRefreshState());
      const explorer = dispatch(fallbackExplorerInit());

      return Promise.all([
        delay(1250), // minimum duration we want the "Pull to Refresh" animation to last
        getWalletNames,
        getUniswapLiquidity,
        getUniqueTokens,
        refetchSavings(),
        explorer,
      ]);
    } catch (error) {
      logger.log('Error refreshing data', error);
      captureException(error);
      throw error;
    }
  }, [dispatch, refetchSavings]);

  return refreshAccountData;
}
