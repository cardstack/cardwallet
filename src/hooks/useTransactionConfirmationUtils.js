import {
  convertHexToString,
  fromWei,
  greaterThan,
  greaterThanOrEqualTo,
} from '@cardstack/cardpay-sdk';
import { useNavigation, useRoute } from '@react-navigation/native';
import BigNumber from 'bignumber.js';
import { get, isEmpty, isNil, omit } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { InteractionManager, Vibration } from 'react-native';
import { isEmulatorSync } from 'react-native-device-info';
import { useDispatch, useSelector } from 'react-redux';

import {
  sendTransaction,
  signMessage,
  signPersonalMessage,
  signTransaction,
  signTypedDataMessage,
} from '../model/wallet';
import { methodRegistryLookupAndParse } from '../utils/methodRegistry';
import {
  isMessageDisplayType,
  isSignFirstParamType,
  isSignSecondParamType,
  PERSONAL_SIGN,
  SEND_TRANSACTION,
  SIGN,
  SIGN_TYPED_DATA,
} from '../utils/signingMethods';
import useAccountAssets from './useAccountAssets';
import useGas from './useGas';
import useTransactionConfirmation from './useTransactionConfirmation';
import {
  estimateGas,
  estimateGasWithPadding,
  toHex,
} from '@rainbow-me/handlers/web3';
import { walletConnectRemovePendingRedirect } from '@rainbow-me/redux/walletconnect';
import { ethereumUtils } from '@rainbow-me/utils';
import logger from 'logger';

export const useTransactionConfirmationUtils = () => {
  const { params: routeParams } = useRoute();

  const {
    callback,
    transactionDetails: {
      dappName,
      dappScheme,
      dappUrl,
      displayDetails,
      payload: { method, params },
      peerId,
      requestId,
    },
  } = routeParams;

  const message = params[1].message;

  const { allAssets } = useAccountAssets();
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const calculatingGasLimit = useRef(false);
  const [methodName, setMethodName] = useState(null);
  const [isBalanceEnough, setIsBalanceEnough] = useState(true);

  const dispatch = useDispatch();
  const { goBack } = useNavigation();

  const pendingRedirect = useSelector(
    ({ walletconnect }) => walletconnect.pendingRedirect
  );

  const {
    dataAddNewTransaction,
    removeRequest,
    walletConnectSendStatus,
  } = useTransactionConfirmation();

  const isMessageRequest = isMessageDisplayType(method);

  const [parsedMessage, setParsedMessage] = useState('');

  useEffect(() => {
    let msg = displayDetails.request;

    try {
      msg = JSON.parse(msg);
      // eslint-disable-next-line no-empty
    } catch (e) {}

    msg = JSON.stringify(msg, null, 4);

    setParsedMessage(msg);
  }, [displayDetails]);

  const {
    gasLimit,
    gasPrices,
    isSufficientGas,
    startPollingGasPrices,
    stopPollingGasPrices,
    updateTxFee,
    selectedGasPrice,
  } = useGas();

  const openAutomatically = routeParams?.openAutomatically;

  const fetchMethodName = useCallback(
    async data => {
      if (!data) return;
      const methodSignaturePrefix = data.substr(0, 10);
      let fallbackHandler;
      try {
        fallbackHandler = setTimeout(() => {
          setMethodName('Transaction Request');
        }, 5000);
        const { name } = await methodRegistryLookupAndParse(
          methodSignaturePrefix
        );
        if (name) {
          setMethodName(name);
          clearTimeout(fallbackHandler);
        }
      } catch (e) {
        setMethodName('Transaction Request');
        clearTimeout(fallbackHandler);
      }
    },
    [setMethodName]
  );

  useEffect(() => {
    if (openAutomatically && !isEmulatorSync()) {
      Vibration.vibrate();
    }

    InteractionManager.runAfterInteractions(() => {
      if (!isMessageRequest) {
        startPollingGasPrices();
        fetchMethodName(params[0].data);
      } else {
        setMethodName('Message Signing Request');
      }
    });
  }, [
    dappUrl,
    fetchMethodName,
    isMessageRequest,
    method,
    openAutomatically,
    params,
    startPollingGasPrices,
  ]);

  const closeScreen = useCallback(
    canceled => {
      goBack();

      if (!isMessageRequest) {
        stopPollingGasPrices();
      }

      if (pendingRedirect) {
        InteractionManager.runAfterInteractions(() => {
          let type = method === SEND_TRANSACTION ? 'transaction' : 'sign';

          if (canceled) {
            type = `${type}-canceled`;
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
  }, [
    callback,
    closeScreen,
    dispatch,
    peerId,
    removeRequest,
    requestId,
    walletConnectSendStatus,
  ]);

  const calculateGasLimit = useCallback(async () => {
    calculatingGasLimit.current = true;
    const txPayload = get(params, '[0]');
    // use the default
    let gas = txPayload.gasLimit || txPayload.gas;

    try {
      // attempt to re-run estimation
      logger.log('Estimating gas limit');
      const rawGasLimit = await estimateGas(txPayload);
      logger.log('Estimated gas limit', rawGasLimit);

      if (rawGasLimit) {
        gas = toHex(rawGasLimit);
      }
    } catch (error) {
      logger.log('error estimating gas', error);
    }

    logger.log('Setting gas limit to', convertHexToString(gas));
    // Wait until the gas prices are populated
    setTimeout(() => {
      updateTxFee(gas);
    }, 1000);
  }, [params, updateTxFee]);

  useEffect(() => {
    if (
      !isEmpty(gasPrices) &&
      !calculatingGasLimit.current &&
      !isMessageRequest
    ) {
      InteractionManager.runAfterInteractions(() => {
        calculateGasLimit();
      });
    }
  }, [
    calculateGasLimit,
    gasLimit,
    gasPrices,
    isMessageRequest,
    method,
    params,
    updateTxFee,
  ]);

  useEffect(() => {
    if (isMessageRequest) {
      setIsBalanceEnough(true);

      return;
    }

    if (!isSufficientGas) {
      setIsBalanceEnough(false);

      return;
    }

    const { txFee } = selectedGasPrice;

    if (!txFee) {
      setIsBalanceEnough(false);

      return;
    }

    // Get the TX fee Amount
    const txFeeAmount = fromWei(get(txFee, 'value.amount', 0));

    // Get the ETH balance
    const ethAsset = ethereumUtils.getAsset(allAssets);
    const balanceAmount = get(ethAsset, 'balance.amount', 0);

    // Get the TX value
    const txPayload = get(params, '[0]');
    const value = get(txPayload, 'value', 0);

    // Check that there's enough ETH to pay for everything!
    const totalAmount = new BigNumber(fromWei(value)).plus(txFeeAmount);
    const isEnough = greaterThanOrEqualTo(balanceAmount, totalAmount);

    setIsBalanceEnough(isEnough);
  }, [
    allAssets,
    isBalanceEnough,
    isMessageRequest,
    isSufficientGas,
    method,
    params,
    selectedGasPrice,
  ]);

  const handleConfirmTransaction = useCallback(async () => {
    const sendInsteadOfSign = method === SEND_TRANSACTION;
    const txPayload = get(params, '[0]');
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
      const rawGasLimit = await estimateGasWithPadding(txPayload);

      // If the estimation with padding is higher or gas limit was missing,
      // let's use the higher value
      if (
        (isNil(gas) && isNil(gasLimitFromPayload)) ||
        (!isNil(gas) && greaterThan(rawGasLimit, convertHexToString(gas))) ||
        (!isNil(gasLimitFromPayload) &&
          greaterThan(rawGasLimit, convertHexToString(gasLimitFromPayload)))
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
      const { nonce, hash } = result;

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
    dispatch,
    displayDetails,
    dappName,
    dataAddNewTransaction,
    removeRequest,
    walletConnectSendStatus,
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
      case SIGN:
        flatFormatSignature = await signMessage(messageForSigning);
        break;
      case PERSONAL_SIGN:
        flatFormatSignature = await signPersonalMessage(messageForSigning);
        break;
      case SIGN_TYPED_DATA:
        flatFormatSignature = await signTypedDataMessage(messageForSigning);
        break;
      default:
        break;
    }

    if (flatFormatSignature) {
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
    method,
    onCancel,
    params,
    peerId,
    removeRequest,
    requestId,
    walletConnectSendStatus,
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

  const onPressSend = useCallback(async () => {
    if (isAuthorizing) return;
    setIsAuthorizing(true);

    try {
      await onConfirm();
      setIsAuthorizing(false);
    } catch (error) {
      setIsAuthorizing(false);
    }
  }, [isAuthorizing, onConfirm]);

  return {
    onPressSend,
    onCancel,
    message,
    isMessageRequest,
    dappUrl,
    methodName,
    messageRequest: parsedMessage,
  };
};
