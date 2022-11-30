import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import WalletConnect from '@cardstack/models/wallet-connect';
import { removeRequest } from '@cardstack/redux/requests';

import { walletConnectSendStatus } from '@rainbow-me/redux/walletconnect';
import logger from 'logger';

import { useCloseScreen } from './use-close-screen';
import { useRouteParams } from './use-route-params';

export const useCancelTransaction = () => {
  const dispatch = useDispatch();
  const closeScreen = useCloseScreen();

  const {
    callback,
    transactionDetails: { peerId, requestId, event },
  } = useRouteParams();

  const onCancel = useCallback(async () => {
    try {
      if (event) {
        WalletConnect.rejectRequest(event);
      }

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
  }, [callback, closeScreen, dispatch, event, peerId, requestId]);

  return onCancel;
};
