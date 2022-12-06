import { convertHexToString } from '@cardstack/cardpay-sdk';
import { get, isNil, omit } from 'lodash';
import { useState, useCallback } from 'react';
import { greaterThan } from 'react-native-reanimated';
import { useDispatch } from 'react-redux';

import WalletConnect from '@cardstack/models/wallet-connect';
import { removeRequest } from '@cardstack/redux/requests';

import { toHex, estimateGasWithPadding } from '@rainbow-me/handlers/web3';
import { useGas } from '@rainbow-me/hooks';
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
    },
  } = useRouteParams();

  const dispatch = useDispatch();

  const { gasLimit, selectedGasPrice } = useGas();

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
    const txPayload = get(params, '[0]');
    // eslint-disable-next-line prefer-const
    let { gas, gasLimit: gasLimitFromPayload, gasPrice } = txPayload;

    const rawGasPrice = get(selectedGasPrice, 'value.amount');

    if (rawGasPrice) {
      gasPrice = toHex(rawGasPrice);
    }

    try {
      logger.log('⛽ gas suggested by dapp', {
        gas: convertHexToString(gas),
        gasLimitFromPayload: convertHexToString(gasLimitFromPayload),
      });

      // Estimate the tx with gas limit padding before sending
      const rawGasLimit = (await estimateGasWithPadding(txPayload)) as any;

      // If the estimation with padding is higher or gas limit was missing,
      // let's use the higher value
      if (
        (isNil(gas) && isNil(gasLimitFromPayload)) ||
        (!isNil(gas) &&
          greaterThan(rawGasLimit, convertHexToString(gas) as any)) ||
        (!isNil(gasLimitFromPayload) &&
          greaterThan(
            rawGasLimit,
            convertHexToString(gasLimitFromPayload) as any
          ))
      ) {
        logger.log('⛽ using padded estimation!', rawGasLimit.toString());
        gas = toHex(rawGasLimit);
      }
    } catch (error) {
      logger.log('⛽ error estimating gas', error);
    }

    const calculatedGasLimit = gas || gasLimitFromPayload || gasLimit;

    let txPayloadUpdated = {
      ...txPayload,
      gasPrice,
    };

    if (calculatedGasLimit) {
      txPayloadUpdated.gasLimit = calculatedGasLimit;
    }

    txPayloadUpdated = omit(txPayloadUpdated, ['from', 'gas']);

    try {
      if (sendInsteadOfSign) {
        const result = await sendTransaction({
          transaction: txPayloadUpdated,
        });

        if (result) {
          const { hash, nonce } = result;

          const txDetails = {
            amount: get(displayDetails, 'request.value'),
            asset: get(displayDetails, 'request.asset'),
            dappName,
            from: get(displayDetails, 'request.from'),
            gasLimit,
            gasPrice,
            hash,
            nonce,
            to: get(displayDetails, 'request.to'),
          };

          dispatch(dataAddNewTransaction(txDetails));

          await sendResponseToWalletConnect(hash);
        }
      } else {
        const signature = await signTransaction({
          transaction: txPayloadUpdated,
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
    selectedGasPrice,
    gasLimit,
    closeScreen,
    displayDetails,
    dappName,
    dispatch,
    sendResponseToWalletConnect,
  ]);

  const handleSignMessage = useCallback(async () => {
    const messageForSigning = get(
      params,
      isSignFirstParamType(method) ? '[0]' : '[1]'
    );

    try {
      const sign =
        method === SIGN_TYPED_DATA ? signTypedDataMessage : signPersonalMessage;

      const flatFormatSignature = await sign(messageForSigning);

      await sendResponseToWalletConnect(flatFormatSignature);
    } catch (e) {
      logger.sentry(`Error while signing message`, e);
    }

    closeScreen();
  }, [closeScreen, method, params, sendResponseToWalletConnect]);

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
