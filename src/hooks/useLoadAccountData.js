import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { dataLoadState } from '../redux/data';
import { walletConnectLoadState } from '../redux/walletconnect';
import { promiseUtils } from '../utils';
import useAccountSettings from './useAccountSettings';
import { collectiblesLoadState } from '@cardstack/redux/collectibles';
import { requestsLoadState } from '@cardstack/redux/requests';
import logger from 'logger';

export default function useLoadAccountData() {
  const { isOnCardPayNetwork } = useAccountSettings();

  const dispatch = useDispatch();

  const loadAccountData = useCallback(async () => {
    logger.sentry('Load wallet account data');
    if (isOnCardPayNetwork) {
      // Update data state on wallet initializion for layer1.
      // This is performed in layer2 when loading gnosis safes.
      await dispatch(dataLoadState());
    }
    const p1 = dispatch(collectiblesLoadState());
    const p2 = dispatch(requestsLoadState());
    const p3 = dispatch(walletConnectLoadState());

    return promiseUtils.PromiseAllWithFails([p1, p2, p3]);
  }, [dispatch, isOnCardPayNetwork]);

  return loadAccountData;
}
