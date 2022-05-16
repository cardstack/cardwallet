import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { dataLoadState } from '../redux/data';
import { walletConnectLoadState } from '../redux/walletconnect';
import { promiseUtils } from '../utils';
import { collectiblesLoadState } from '@cardstack/redux/collectibles';
import { requestsLoadState } from '@cardstack/redux/requests';
import { isLayer1, isMainnet } from '@cardstack/utils';
import logger from 'logger';

export default function useLoadAccountData() {
  const dispatch = useDispatch();

  const loadAccountData = useCallback(
    async network => {
      logger.sentry('Load wallet account data');
      if (isLayer1(network)) {
        // Update data state on wallet initializion for layer1.
        // This is performed in layer2 when loading gnosis safes.
        await dispatch(dataLoadState());
      }
      const promises = [];
      if (isMainnet(network)) {
        const p2 = dispatch(collectiblesLoadState());
        promises.push(p2);
      }
      const p3 = dispatch(requestsLoadState());
      const p4 = dispatch(walletConnectLoadState());

      promises.push(p3, p4);

      return promiseUtils.PromiseAllWithFails(promises);
    },
    [dispatch]
  );

  return loadAccountData;
}
