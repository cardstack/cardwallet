import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { InteractionManager } from 'react-native';
import { useDispatch } from 'react-redux';

import { Routes } from '@cardstack/navigation';
import { WCRedirectTypes } from '@cardstack/screens/sheets/WalletConnectRedirectSheet';

import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import { walletConnectRemovePendingRedirect } from '@rainbow-me/redux/walletconnect';
import { SEND_TRANSACTION } from '@rainbow-me/utils/signingMethods';

import { useRouteParams } from './use-route-params';

export const useCloseScreen = () => {
  const dispatch = useDispatch();
  const { goBack, canGoBack, navigate } = useNavigation();

  const pendingRedirect = useRainbowSelector(
    ({ walletconnect }) => walletconnect.pendingRedirect
  );

  const {
    transactionDetails: {
      dappScheme,
      payload: { method },
    },
  } = useRouteParams();

  const closeScreen = useCallback(
    ({ canceled }: { canceled?: boolean } = {}) => {
      if (canGoBack()) {
        goBack();
      } else {
        navigate(Routes.WALLET_SCREEN);
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
    [goBack, pendingRedirect, method, dappScheme, dispatch, canGoBack, navigate]
  );

  return closeScreen;
};
