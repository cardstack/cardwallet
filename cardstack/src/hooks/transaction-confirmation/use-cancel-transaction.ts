import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { useCloseScreen } from './use-close-screen';
import { useRouteParams } from './use-route-params';
import logger from 'logger';
import { walletConnectSendStatus } from '@rainbow-me/redux/walletconnect';
import { removeRequest } from '@cardstack/redux/requests';

export const useCancelTransaction = () => {
  const dispatch = useDispatch();
  const closeScreen = useCloseScreen();

  const {
    callback,
    transactionDetails: { peerId, requestId },
  } = useRouteParams();

  const onCancel = useCallback(async () => {
    try {
      closeScreen(true);

      if (callback) {
        callback({ error: 'User cancelled the request' });
      }

      setTimeout(async () => {
        if (requestId) {
          await dispatch(walletConnectSendStatus(peerId, requestId, null));
          dispatch(removeRequest(requestId));
        }
      }, 300);
    } catch (error) {
      logger.log('error while handling cancel request', error);
      closeScreen(true);
    }
  }, [callback, closeScreen, dispatch, peerId, requestId]);

  return onCancel;
};
