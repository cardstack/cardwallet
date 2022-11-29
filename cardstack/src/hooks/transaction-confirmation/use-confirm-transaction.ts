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
  isMessageDisplayType,
  isSignFirstParamType,
  isSignSecondParamType,
  SIGN,
  PERSONAL_SIGN,
  SIGN_TYPED_DATA,
} from '@rainbow-me/utils/signingMethods';
import logger from 'logger';

import {
  sendTransaction,
  signTransaction,
  signPersonalMessage,
  signTypedDataMessage,
} from '../../../../src/model/wallet';

import { useCancelTransaction } from './use-cancel-transaction';
import { useCloseScreen } from './use-close-screen';
import { useIsBalanceEnough } from './use-is-balance-enough';
import { useRouteParams } from './use-route-params';

export const useConfirmTransaction = () => {
  const {
    callback,
    transactionDetails: {
      dappName,
      displayDetails,
      payload: { method, params },
      peerId,
      requestId,
      event,
    },
  } = useRouteParams();

  const { gasLimit, selectedGasPrice } = useGas();

  const dispatch = useDispatch();
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const isBalanceEnough = useIsBalanceEnough();
  const isMessageRequest = isMessageDisplayType(method);
  const closeScreen = useCloseScreen();
  const onCancel = useCancelTransaction();

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
    let result = null;

    try {
      if (sendInsteadOfSign) {
        result = await sendTransaction({
          transaction: txPayloadUpdated,
        });
      } else {
        result = await signTransaction({
          transaction: txPayloadUpdated,
        });
      }
    } catch (e) {
      logger.log(
        `Error while ${sendInsteadOfSign ? 'sending' : 'signing'} transaction`,
        e
      );
    }

    if (result) {
      const { nonce, hash } = result as { nonce: any; hash: any };

      if (callback) {
        callback({ result: hash });
      }

      if (sendInsteadOfSign) {
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
      }

      if (requestId) {
        dispatch(removeRequest(requestId));
        await dispatch(walletConnectSendStatus(peerId, requestId, hash));
      }

      closeScreen(false);
    } else {
      await onCancel();
    }
  }, [
    method,
    params,
    selectedGasPrice,
    gasLimit,
    callback,
    requestId,
    closeScreen,
    displayDetails,
    dappName,
    dispatch,
    peerId,
    onCancel,
  ]);

  const handleSignMessage = useCallback(async () => {
    let messageForSigning = null;
    let flatFormatSignature = null;

    if (isSignFirstParamType(method)) {
      messageForSigning = get(params, '[0]');
    } else if (isSignSecondParamType(method)) {
      messageForSigning = get(params, '[1]');
    }

    switch (method) {
      case PERSONAL_SIGN:
      case SIGN:
        flatFormatSignature = await signPersonalMessage(messageForSigning);
        break;
      case SIGN_TYPED_DATA:
        flatFormatSignature = await signTypedDataMessage(messageForSigning);
        break;
      default:
        break;
    }

    if (flatFormatSignature) {
      if (event) {
        WalletConnect.approveRequest(event, flatFormatSignature);
      }

      if (requestId) {
        dispatch(removeRequest(requestId));
        await dispatch(
          walletConnectSendStatus(peerId, requestId, flatFormatSignature)
        );
      }

      if (callback) {
        callback({ sig: flatFormatSignature });
      }

      closeScreen(false);
    } else {
      await onCancel();
    }
  }, [
    callback,
    closeScreen,
    dispatch,
    event,
    method,
    onCancel,
    params,
    peerId,
    requestId,
  ]);

  const onConfirm = useCallback(async () => {
    if (isMessageRequest) {
      return handleSignMessage();
    }

    if (!isBalanceEnough) return;

    return handleConfirmTransaction();
  }, [
    handleConfirmTransaction,
    handleSignMessage,
    isBalanceEnough,
    isMessageRequest,
  ]);

  const onConfirmTransaction = useCallback(async () => {
    if (isAuthorizing) return;
    setIsAuthorizing(true);

    try {
      await onConfirm();
      setIsAuthorizing(false);
    } catch (error) {
      setIsAuthorizing(false);
    }
  }, [isAuthorizing, onConfirm]);

  return onConfirmTransaction;
};
