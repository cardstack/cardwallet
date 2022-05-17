import {
  convertAmountAndPriceToNativeDisplay,
  convertAmountFromNativeValue,
  formatInputDecimals,
} from '@cardstack/cardpay-sdk';
import { useNavigation, useRoute } from '@react-navigation/native';
import { captureEvent, captureException } from '@sentry/react-native';
import { get, isEmpty, isString } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { InteractionManager, Keyboard } from 'react-native';
import { useDispatch } from 'react-redux';
import { SendSheetType } from '../components/send';
import SendSheet, {
  useSendAddressValidation,
  useShowAssetFlags,
} from '../components/send/SendSheet';
import { createSignableTransaction, estimateGasLimit } from '../handlers/web3';
import AssetTypes from '../helpers/assetTypes';
import { sendTransaction } from '../model/wallet';
import { SEND_TRANSACTION_ERROR_MESSAGE } from '@cardstack/constants';
import { Routes, useLoadingOverlay } from '@cardstack/navigation';
import { isLayer2, isNativeToken } from '@cardstack/utils';
import { Alert } from '@rainbow-me/components/alerts';
import {
  useAccountAssets,
  useAccountSettings,
  useGas,
  useMagicAutofocus,
  useMaxInputBalance,
  usePrevious,
  useRefreshAccountData,
  useSendableCollectibles,
  useSendSavingsAccount,
  useTransactionConfirmation,
  useUpdateAssetOnchainBalance,
} from '@rainbow-me/hooks';
import { ETH_ADDRESS_SYMBOL } from '@rainbow-me/references/addresses';

import { gasUtils } from '@rainbow-me/utils';
import logger from 'logger';

const useSendSheetScreen = () => {
  const dispatch = useDispatch();

  const { navigate } = useNavigation();
  const { params } = useRoute();
  const { dataAddNewTransaction } = useTransactionConfirmation();
  const updateAssetOnchainBalanceIfNeeded = useUpdateAssetOnchainBalance();
  const { allAssets } = useAccountAssets();

  const {
    gasLimit,
    gasPrices,
    isSufficientGas,
    selectedGasPrice,
    startPollingGasPrices,
    stopPollingGasPrices,
    txFees,
    updateDefaultGasLimit,
    updateGasPriceOption,
    updateTxFee,
  } = useGas();

  const recipientFieldRef = useRef();
  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  const { accountAddress, nativeCurrency, network } = useAccountSettings();

  const { sendableCollectibles } = useSendableCollectibles();
  const savings = useSendSavingsAccount();
  const fetchData = useRefreshAccountData();

  const [amountDetails, setAmountDetails] = useState({
    assetAmount: '',
    isSufficientBalance: false,
    nativeAmount: '',
  });

  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [selected, setSelected] = useState({});
  const { maxInputBalance, updateMaxInputBalance } = useMaxInputBalance();

  const prevSelectedGasPrice = usePrevious(selectedGasPrice);

  const isValidAddress = useSendAddressValidation(recipient);

  const { showAssetList, showAssetForm } = useShowAssetFlags(
    isValidAddress,
    selected
  );

  const { handleFocus, triggerFocus } = useMagicAutofocus(
    recipientFieldRef,
    useCallback(
      lastFocusedRef => (showAssetList ? null : lastFocusedRef.current),
      [showAssetList]
    )
  );

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => startPollingGasPrices());
    return () => {
      InteractionManager.runAfterInteractions(() => stopPollingGasPrices());
    };
  }, [startPollingGasPrices, stopPollingGasPrices]);

  // Recalculate balance when gas price changes
  useEffect(() => {
    if (
      isNativeToken(selected?.symbol, network) &&
      get(prevSelectedGasPrice, 'txFee.value.amount', 0) !==
        get(selectedGasPrice, 'txFee.value.amount', 0)
    ) {
      updateMaxInputBalance(selected);
    }
  }, [
    prevSelectedGasPrice,
    selected,
    selectedGasPrice,
    updateMaxInputBalance,
    network,
  ]);

  const sendUpdateAssetAmount = useCallback(
    newAssetAmount => {
      const _assetAmount = newAssetAmount.replace(/[^0-9.]/g, '');
      let _nativeAmount = '';
      if (_assetAmount.length) {
        const priceUnit = get(selected, 'price.value', 0);
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
    [maxInputBalance, nativeCurrency, selected]
  );

  const onSelectAsset = useCallback(
    newSelected => {
      updateMaxInputBalance(newSelected);
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

        // Selection might be empty so we check before trying to update
        if (isEmpty(newSelected)) return;

        // Since we don't trust the balance from zerion,
        // let's hit the blockchain and update it
        updateAssetOnchainBalanceIfNeeded(
          newSelected,
          accountAddress,
          updatedAsset => {
            // set selected asset with new balance
            setSelected(updatedAsset);
            // Update selected to recalculate the maxInputAmount
            onSelectAsset(updatedAsset);
          }
        );
      }
    },
    [
      accountAddress,
      sendUpdateAssetAmount,
      updateAssetOnchainBalanceIfNeeded,
      updateMaxInputBalance,
    ]
  );

  const onChangeNativeAmount = useCallback(
    newNativeAmount => {
      if (!isString(newNativeAmount)) return;
      const _nativeAmount = newNativeAmount.replace(/[^0-9.]/g, '');
      let _assetAmount = '';
      if (_nativeAmount.length) {
        const priceUnit = get(selected, 'price.value', 0);
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
    [maxInputBalance, selected]
  );

  const onMaxBalancePress = useCallback(async () => {
    const newBalanceAmount = await updateMaxInputBalance(selected);
    sendUpdateAssetAmount(newBalanceAmount);
  }, [selected, sendUpdateAssetAmount, updateMaxInputBalance]);

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
      isValidAddress && amountDetails.isSufficientBalance && isSufficientGas;
    if (!selectedGasPrice.txFee || !validTransaction || isAuthorizing) {
      logger.sentry('preventing tx submit for one of the following reasons:');
      logger.sentry('selectedGasPrice.txFee ? ', selectedGasPrice?.txFee);
      logger.sentry('validTransaction ? ', validTransaction);
      logger.sentry('isAuthorizing ? ', isAuthorizing);
      captureEvent('Preventing tx submit');
      return false;
    }

    let submitSuccess = false;
    let updatedGasLimit = null;
    // Attempt to update gas limit before sending ERC20 / ERC721
    if (selected?.address !== ETH_ADDRESS_SYMBOL) {
      try {
        // Estimate the tx with gas limit padding before sending
        updatedGasLimit = await estimateGasLimit(
          {
            address: accountAddress,
            amount: amountDetails.assetAmount,
            asset: selected,
            recipient,
          },
          network,
          true
        );
        logger.log('gasLimit updated before sending', {
          after: updatedGasLimit,
          before: gasLimit,
        });
        updateTxFee(updatedGasLimit);
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }

    const txDetails = {
      amount: amountDetails.assetAmount,
      asset: selected,
      from: accountAddress,
      gasLimit: updatedGasLimit || gasLimit,
      gasPrice: get(selectedGasPrice, 'value.amount'),
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
    amountDetails.assetAmount,
    amountDetails.isSufficientBalance,
    dataAddNewTransaction,
    dispatch,
    gasLimit,
    isAuthorizing,

    isSufficientGas,
    isValidAddress,
    network,
    recipient,
    selected,
    selectedGasPrice,

    updateTxFee,
  ]);

  const submitTransaction = useCallback(async () => {
    setIsAuthorizing(true);
    if (Number(amountDetails.assetAmount) <= 0) {
      logger.sentry('amountDetails.assetAmount ? ', amountDetails?.assetAmount);
      captureEvent('Preventing tx submit due to amount <= 0');
      return false;
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

  const onPressTransactionSpeed = useCallback(
    onSuccess => {
      const hideCustom = true;
      gasUtils.showTransactionSpeedOptions(
        gasPrices,
        txFees,
        gasPriceOption => updateGasPriceOption(gasPriceOption),
        onSuccess,
        hideCustom
      );
    },
    [txFees, gasPrices, updateGasPriceOption]
  );

  const onSendPress = useCallback(submitTransaction, [submitTransaction]);

  const onResetAssetSelection = useCallback(() => {
    onSelectAsset({});
  }, [onSelectAsset]);

  useEffect(() => {
    updateDefaultGasLimit();
  }, [updateDefaultGasLimit]);

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
      estimateGasLimit(
        {
          address: accountAddress,
          amount: amountDetails.assetAmount,
          asset: selected,
          recipient,
        },
        network
      )
        .then(gasLimit => updateTxFee(gasLimit))
        .catch(() => updateTxFee(null));
    }
  }, [
    accountAddress,
    amountDetails.assetAmount,
    dispatch,
    isValidAddress,
    network,
    recipient,
    selected,
    updateTxFee,
  ]);

  return {
    isValidAddress,
    handleFocus,
    setRecipient,
    triggerFocus,
    recipient,
    recipientFieldRef,
    allAssets,
    fetchData,
    nativeCurrency,
    network,
    onSelectAsset,
    savings,
    sendableCollectibles,
    amountDetails,
    isAuthorizing,
    isSufficientGas,
    onSendPress,
    onChangeAssetAmount,
    onChangeNativeAmount,
    onResetAssetSelection,
    selected,
    onMaxBalancePress,
    selectedGasPrice,
    onPressTransactionSpeed: isLayer2(network)
      ? undefined
      : onPressTransactionSpeed, // Temporary turn off gas price picker on layer 2
    // without price, hide fiat field, since there's no way to calculate it
    showNativeCurrencyField: Boolean(selected?.price?.value),
  };
};

export default function SendSheetEOA() {
  const props = useSendSheetScreen();

  return <SendSheet {...props} type={SendSheetType.SEND_FROM_EOA} />;
}
