import { convertHexToString } from '@cardstack/cardpay-sdk';
import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import WalletConnect from '@cardstack/models/wallet-connect';
import { removeRequest } from '@cardstack/redux/requests';

import { dataAddNewTransaction } from '@rainbow-me/redux/data';
import { walletConnectSendStatus } from '@rainbow-me/redux/walletconnect';
import {
  SEND_TRANSACTION,
  isSignFirstParamType,
  SIGN_TYPED_DATA,
} from '@rainbow-me/utils/signingMethods';
import logger from 'logger';

import {
  sendTransaction,
  signTransaction,
  signPersonalMessage,
  signTypedDataMessage,
} from '../../../../src/model/wallet';

import { useCloseScreen } from './use-close-screen';
import { useRouteParams } from './use-route-params';

export const useTransactionActions = (isMessageRequest: boolean) => {
  const {
    transactionDetails: {
      dappName,
      displayDetails,
      payload: { method, params },
      peerId,
      requestId,
      event,
      txNetwork,
    },
  } = useRouteParams();

  const dispatch = useDispatch();

  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const closeScreen = useCloseScreen();

  const sendResponseToWalletConnect = useCallback(
    (signatureOrHash?: string | null) => {
      if (event) {
        return signatureOrHash
          ? WalletConnect.approveRequest(event, signatureOrHash)
          : WalletConnect.rejectRequest(event);
      }

      if (requestId) {
        dispatch(removeRequest(requestId));

        return dispatch(
          walletConnectSendStatus(peerId, requestId, signatureOrHash)
        );
      }
    },
    [dispatch, event, peerId, requestId]
  );

  const handleConfirmTransaction = useCallback(async () => {
    const sendInsteadOfSign = method === SEND_TRANSACTION;
    const txPayload = params?.[0];

    const {
      gas,
      gasLimit: gasLimitFromPayload,
      gasPrice,
      ...txPayloadWithoutGas
    } = txPayload;

    logger.log('⛽ gas suggested by dapp', {
      gas: convertHexToString(gas),
      gasLimitFromPayload: convertHexToString(gasLimitFromPayload),
    });

    const gasLimit = gas || gasLimitFromPayload;

    const txPayloadUpdated = {
      ...txPayloadWithoutGas,
      gasPrice,
      gasLimit,
    };

    try {
      if (sendInsteadOfSign) {
        const result = await sendTransaction({
          transaction: txPayloadUpdated,
          network: txNetwork,
        });

        if (result) {
          const { hash, nonce } = result;
          const { value: amount, asset, from, to } = displayDetails?.request;

          const txDetails = {
            amount,
            asset,
            dappName,
            from,
            gasLimit,
            gasPrice,
            hash,
            nonce,
            to,
          };

          dispatch(dataAddNewTransaction(txDetails));

          await sendResponseToWalletConnect(hash);
        }
      } else {
        const signature = await signTransaction({
          transaction: txPayloadUpdated,
          network: txNetwork,
        });

        await sendResponseToWalletConnect(signature);
      }
    } catch (e) {
      logger.sentry(
        `Error while ${sendInsteadOfSign ? 'sending' : 'signing'} transaction`,
        e
      );
    }

    closeScreen();
  }, [
    method,
    params,
    closeScreen,
    txNetwork,
    displayDetails.request,
    dappName,
    dispatch,
    sendResponseToWalletConnect,
  ]);

  const handleSignMessage = useCallback(async () => {
    const messageForSigning = params?.[isSignFirstParamType(method) ? 0 : 1];

    try {
      const sign =
        method === SIGN_TYPED_DATA ? signTypedDataMessage : signPersonalMessage;

      const flatFormatSignature = await sign(messageForSigning, txNetwork);

      await sendResponseToWalletConnect(flatFormatSignature);
    } catch (e) {
      logger.sentry(`Error while signing message`, e);
    }

    closeScreen();
  }, [closeScreen, method, params, sendResponseToWalletConnect, txNetwork]);

  const onConfirmTransaction = useCallback(async () => {
    if (isAuthorizing) return;
    setIsAuthorizing(true);

    const confirm = isMessageRequest
      ? handleSignMessage
      : handleConfirmTransaction;

    try {
      await confirm();

      setIsAuthorizing(false);
    } catch (error) {
      setIsAuthorizing(false);
    }
  }, [
    handleConfirmTransaction,
    handleSignMessage,
    isAuthorizing,
    isMessageRequest,
  ]);

  const onCancel = useCallback(async () => {
    try {
      await sendResponseToWalletConnect();
    } catch (error) {
      logger.log('error while handling cancel request', error);
    }

    closeScreen({ canceled: true });
  }, [closeScreen, sendResponseToWalletConnect]);

  return { onConfirm: onConfirmTransaction, isAuthorizing, onCancel };
};
