import { useCallback } from 'react';
import { InteractionManager } from 'react-native';
import { useDispatch } from 'react-redux';

import { useRouteParams } from './use-route-params';
import { WCRedirectTypes } from '@cardstack/screen/sheets/WalletConnectRedirectSheet';
import {
  SEND_TRANSACTION,
  isMessageDisplayType,
} from '@rainbow-me/utils/signingMethods';
import { walletConnectRemovePendingRedirect } from '@rainbow-me/redux/walletconnect';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import { useGas } from '@rainbow-me/hooks';

export const useCloseScreen = () => {
  const dispatch = useDispatch();
  const { goBack } = useNavigation();

  const pendingRedirect = useRainbowSelector(
    ({ walletconnect }) => walletconnect.pendingRedirect
  );

  const { stopPollingGasPrices } = useGas();

  const {
    transactionDetails: {
      dappScheme,
      payload: { method },
    },
  } = useRouteParams();

  const isMessageRequest = isMessageDisplayType(method);

  const closeScreen = useCallback(
    canceled => {
      goBack();

      if (!isMessageRequest) {
        stopPollingGasPrices();
      }

      if (pendingRedirect) {
        InteractionManager.runAfterInteractions(() => {
          let type: WCRedirectTypes =
            method === SEND_TRANSACTION
              ? WCRedirectTypes.transaction
              : WCRedirectTypes.sign;

          if (canceled) {
            type =
              method === SEND_TRANSACTION
                ? WCRedirectTypes.transactionCanceled
                : WCRedirectTypes.signCanceled;
          }

          dispatch(walletConnectRemovePendingRedirect(type, dappScheme));
        });
      }
    },
    [
      goBack,
      isMessageRequest,
      pendingRedirect,
      stopPollingGasPrices,
      method,
      dappScheme,
      dispatch,
    ]
  );

  return closeScreen;
};
