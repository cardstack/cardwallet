import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { addCashLoadState } from '../redux/addCash';
import { dataLoadState } from '../redux/data';
import { coinListLoadState } from '../redux/editOptions';
import { openStateSettingsLoadState } from '../redux/openStateSettings';
import { requestsLoadState } from '../redux/requests';
import { uniswapLoadState } from '../redux/uniswap';
import { uniswapLiquidityLoadState } from '../redux/uniswapLiquidity';
import { walletConnectLoadState } from '../redux/walletconnect';
import { promiseUtils } from '../utils';
import { collectiblesLoadState } from '@cardstack/redux/collectibles';
import { isMainnet } from '@cardstack/utils';
import logger from 'logger';

export default function useLoadAccountData() {
  const dispatch = useDispatch();

  const loadAccountData = useCallback(
    async network => {
      logger.sentry('Load wallet account data');
      await dispatch(openStateSettingsLoadState());
      await dispatch(coinListLoadState());
      await dispatch(dataLoadState());
      const promises = [];
      if (isMainnet(network)) {
        const p2 = dispatch(collectiblesLoadState());
        promises.push(p2);
      }
      const p3 = dispatch(requestsLoadState());
      const p4 = dispatch(walletConnectLoadState());
      const p5 = dispatch(uniswapLoadState());
      const p6 = dispatch(addCashLoadState());
      const p7 = dispatch(uniswapLiquidityLoadState());
      promises.push(p3, p4, p5, p6, p7);

      return promiseUtils.PromiseAllWithFails(promises);
    },
    [dispatch]
  );

  return loadAccountData;
}
