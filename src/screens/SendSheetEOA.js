import {
  convertAmountAndPriceToNativeDisplay,
  convertAmountFromNativeValue,
  formatInputDecimals,
} from '@cardstack/cardpay-sdk';
import { useNavigation, useRoute } from '@react-navigation/native';
import { captureEvent, captureException } from '@sentry/react-native';
import { get, isEmpty, isString } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard } from 'react-native';
import { useDispatch } from 'react-redux';
import { SendSheetType } from '../components/send';
import SendSheet, {
  useSendAddressValidation,
  useShowAssetFlags,
} from '../components/send/SendSheet';
import { createSignableTransaction } from '../handlers/web3';
import { sendTransaction } from '../model/wallet';
import { SEND_TRANSACTION_ERROR_MESSAGE } from '@cardstack/constants';
import { useGas } from '@cardstack/hooks';
import { useAssets } from '@cardstack/hooks/assets/useAssets';
import { Routes, useLoadingOverlay } from '@cardstack/navigation';
import { AssetTypes } from '@cardstack/types';
import { isNativeToken } from '@cardstack/utils';
import { Alert } from '@rainbow-me/components/alerts';
import {
  useAccountSettings,
  useMaxInputBalance,
  usePrevious,
  useSendableCollectibles,
} from '@rainbow-me/hooks';
import { dataAddNewTransaction } from '@rainbow-me/redux/data';

import logger from 'logger';

const useSendSheetScreen = () => {
  const dispatch = useDispatch();

  const { navigate } = useNavigation();
  const { params } = useRoute();

  const {
    legacyAssetsStruct: allAssets,
    getAssetPrice,
    refetchBalances,
  } = useAssets();

  const recipientFieldRef = useRef();
  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  const {
    accountAddress,
    nativeCurrency,
    network,
    isOnCardPayNetwork,
  } = useAccountSettings();

  const {
    updateTxFees,
    selectedFee,
    hasSufficientForGas,
    showTransactionSpeedActionSheet,
  } = useGas();

  const { sendableCollectibles } = useSendableCollectibles();

  const [amountDetails, setAmountDetails] = useState({
    assetAmount: '',
    isSufficientBalance: false,
    nativeAmount: '',
  });

  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [selected, setSelected] = useState({});
  const { maxInputBalance, updateMaxInputBalance } = useMaxInputBalance();

  const prevSelectedGasPrice = usePrevious(selectedFee);

  const isValidAddress = useSendAddressValidation(recipient);

  const { showAssetList, showAssetForm } = useShowAssetFlags(
    isValidAddress,
    selected
  );

  // Recalculate balance when gas price changes
  useEffect(() => {
    if (
      isNativeToken(selected?.symbol, network) &&
      prevSelectedGasPrice?.value.amount !== selectedFee?.value.amount
    ) {
      updateMaxInputBalance({ selectedAsset: selected, selectedFee, network });
    }
  }, [
    prevSelectedGasPrice,
    selected,
    selectedFee,
    updateMaxInputBalance,
    network,
  ]);

  const sendUpdateAssetAmount = useCallback(
    newAssetAmount => {
      const _assetAmount = newAssetAmount.replace(/[^0-9.]/g, '');
      let _nativeAmount = '';
      if (_assetAmount.length) {
        const priceUnit = getAssetPrice(selected.id);
        const {
          amount: convertedNativeAmount,
        } = convertAmountAndPriceToNativeDisplay(
          _assetAmount,
          priceUnit,
          nativeCurrency
        );
        _nativeAmount = formatInputDecimals(
          convertedNativeAmount,
          _assetAmount
        );
      }
      const _isSufficientBalance =
        Number(_assetAmount) <= Number(maxInputBalance);
      setAmountDetails({
        assetAmount: _assetAmount,
        isSufficientBalance: _isSufficientBalance,
        nativeAmount: _nativeAmount,
      });
    },
    [getAssetPrice, maxInputBalance, nativeCurrency, selected]
  );

  const onSelectAsset = useCallback(
    newSelected => {
      updateMaxInputBalance({
        selectedAsset: newSelected,
        selectedFee,
        network,
      });
      if (get(newSelected, 'type') === AssetTypes.nft) {
        setAmountDetails({
          assetAmount: '1',
          isSufficientBalance: true,
          nativeAmount: '0',
        });
        setSelected({
          ...newSelected,
          symbol: get(newSelected, 'asset_contract.name'),
        });
      } else {
        setSelected(newSelected);
        sendUpdateAssetAmount('');
      }
      refetchBalances();
    },
    [
      refetchBalances,
      sendUpdateAssetAmount,
      updateMaxInputBalance,
      network,
      selectedFee,
    ]
  );

  const onChangeNativeAmount = useCallback(
    newNativeAmount => {
      if (!isString(newNativeAmount)) return;
      const _nativeAmount = newNativeAmount.replace(/[^0-9.]/g, '');
      let _assetAmount = '';
      if (_nativeAmount.length) {
        const priceUnit = getAssetPrice(selected.id);
        const convertedAssetAmount = convertAmountFromNativeValue(
          _nativeAmount,
          priceUnit,
          selected.decimals
        );
        _assetAmount = formatInputDecimals(convertedAssetAmount, _nativeAmount);
      }

      const _isSufficientBalance =
        Number(_assetAmount) <= Number(maxInputBalance);

      setAmountDetails({
        assetAmount: _assetAmount,
        isSufficientBalance: _isSufficientBalance,
        nativeAmount: _nativeAmount,
      });
    },
    [getAssetPrice, maxInputBalance, selected]
  );

  const onMaxBalancePress = useCallback(() => {
    sendUpdateAssetAmount(maxInputBalance);
  }, [sendUpdateAssetAmount, maxInputBalance]);

  const onChangeAssetAmount = useCallback(
    newAssetAmount => {
      if (isString(newAssetAmount)) {
        sendUpdateAssetAmount(newAssetAmount);
      }
    },
    [sendUpdateAssetAmount]
  );

  const onSubmit = useCallback(async () => {
    const validTransaction =
      isValidAddress &&
      amountDetails.isSufficientBalance &&
      hasSufficientForGas;

    if (!selectedFee || !validTransaction || isAuthorizing) {
      logger.sentry('Preventing Tx submit given values:', {
        selectedFee,
        validTransaction,
        isAuthorizing,
      });
      captureEvent('Preventing tx submit');
      return false;
    }

    let submitSuccess = false;

    // Estimate the tx before sending
    const updatedGasLimit = await updateTxFees({
      amount: amountDetails.assetAmount,
      asset: selected,
      recipient,
    });

    const txDetails = {
      amount: amountDetails.assetAmount,
      asset: selected,
      from: accountAddress,
      gasLimit: updatedGasLimit,
      gasPrice: selectedFee.value.amount,
      nonce: null,
      to: recipient,
    };
    try {
      const signableTransaction = await createSignableTransaction(
        txDetails,
        network
      );

      const txResult = await sendTransaction({
        transaction: signableTransaction,
      });

      const { hash, nonce } = txResult;

      if (!isEmpty(hash)) {
        submitSuccess = true;
        txDetails.hash = hash;
        txDetails.nonce = nonce;
        await dispatch(dataAddNewTransaction(txDetails));
      }
    } catch (error) {
      logger.sentry('TX Details', txDetails);
      logger.sentry('SendSheet onSubmit error');
      captureException(error);
      submitSuccess = false;
    } finally {
      setIsAuthorizing(false);
    }
    return submitSuccess;
  }, [
    accountAddress,
    amountDetails,
    dispatch,
    isAuthorizing,
    hasSufficientForGas,
    isValidAddress,
    network,
    recipient,
    selected,
    selectedFee,
    updateTxFees,
  ]);

  const onSendPress = useCallback(async () => {
    setIsAuthorizing(true);
    if (Number(amountDetails.assetAmount) <= 0) {
      logger.sentry('amountDetails.assetAmount ? ', amountDetails?.assetAmount);
      captureEvent('Preventing tx submit due to amount <= 0');
      return;
    }

    try {
      showLoadingOverlay({ title: 'Sending...' });
      const submitSuccessful = await onSubmit();

      if (submitSuccessful) {
        setIsAuthorizing(false);
        navigate(Routes.WALLET_SCREEN, { forceRefreshOnce: true });
      } else {
        setIsAuthorizing(false);
        dismissLoadingOverlay();
      }
    } catch (error) {
      setIsAuthorizing(false);
      dismissLoadingOverlay();
      Alert({ title: SEND_TRANSACTION_ERROR_MESSAGE });
    }
  }, [
    amountDetails.assetAmount,
    dismissLoadingOverlay,
    navigate,
    onSubmit,
    showLoadingOverlay,
  ]);

  const onResetAssetSelection = useCallback(() => {
    onSelectAsset({});
  }, [onSelectAsset]);

  useEffect(() => {
    if (
      (isValidAddress && showAssetList) ||
      (isValidAddress && showAssetForm && selected?.type === AssetTypes.nft)
    ) {
      Keyboard.dismiss();
    }
  }, [isValidAddress, selected, showAssetForm, showAssetList]);

  const assetOverride = params?.asset;

  const prevAssetOverride = usePrevious(assetOverride);

  useEffect(() => {
    if (assetOverride && assetOverride !== prevAssetOverride) {
      onSelectAsset(assetOverride);
    }
  }, [assetOverride, prevAssetOverride, onSelectAsset]);

  const recipientOverride = params?.address;

  useEffect(() => {
    if (recipientOverride && !recipient) {
      setRecipient(recipientOverride);
    }
  }, [recipient, recipientOverride]);

  useEffect(() => {
    if (isValidAddress) {
      updateTxFees({
        amount: amountDetails.assetAmount,
        asset: selected,
        recipient,
      });
    }
  }, [
    amountDetails.assetAmount,
    isValidAddress,
    recipient,
    selected,
    updateTxFees,
  ]);

  return {
    isValidAddress,
    setRecipient,
    recipient,
    recipientFieldRef,
    allAssets,
    nativeCurrency,
    network,
    onSelectAsset,
    savings: [], // TODO: remove saving references on coin list
    sendableCollectibles,
    amountDetails,
    isAuthorizing,
    isSufficientGas: hasSufficientForGas,
    onSendPress,
    onChangeAssetAmount,
    onChangeNativeAmount,
    onResetAssetSelection,
    selected,
    onMaxBalancePress,
    selectedGasPrice: selectedFee,
    onPressTransactionSpeed: isOnCardPayNetwork
      ? undefined
      : showTransactionSpeedActionSheet, // Temporary turn off gas price picker on layer 2
    // without price, hide fiat field, since there's no way to calculate it
    showNativeCurrencyField: Boolean(Number(selected?.native?.balance.amount)),
  };
};

export default function SendSheetEOA() {
  const props = useSendSheetScreen();

  return <SendSheet {...props} type={SendSheetType.SEND_FROM_EOA} />;
}
