import {
  convertAmountAndPriceToNativeDisplay,
  convertAmountFromNativeValue,
  formatInputDecimals,
} from '@cardstack/cardpay-sdk';
import { useRoute } from '@react-navigation/native';
import analytics from '@segment/analytics-react-native';
import { captureEvent, captureException } from '@sentry/react-native';
import { get, isEmpty, isString, toLower } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { InteractionManager, Keyboard, StatusBar } from 'react-native';
import { getStatusBarHeight, isIphoneX } from 'react-native-iphone-x-helper';
import { KeyboardArea } from 'react-native-keyboard-area';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { getSafesInstance } from '../../cardstack/src/models';
import { dismissingScreenListener } from '../../shim';
import { Alert } from '../components/alerts';
import { Column } from '../components/layout';
import {
  SendAssetForm,
  SendAssetList,
  SendButton,
  SendContactList,
  SendHeader,
  SendTransactionSpeed,
} from '../components/send';
import {
  createSignableTransaction,
  estimateGasLimit,
  toWei,
} from '../handlers/web3';
import AssetTypes from '../helpers/assetTypes';
import isNativeStackAvailable from '../helpers/isNativeStackAvailable';
import { checkIsValidAddressOrDomain } from '../helpers/validators';
import { sendTransaction } from '../model/wallet';
import { useNavigation } from '../navigation/Navigation';
import {
  isNativeToken,
  reshapeDepotTokensToAssets,
  reshapeSingleDepotTokenToAsset,
} from '@cardstack/utils';
import {
  useAccountAssets,
  useAccountSettings,
  useCoinListEditOptions,
  useContacts,
  useDimensions,
  useGas,
  useMagicAutofocus,
  useMaxInputBalance,
  usePrevious,
  useRefreshAccountData,
  useSendableUniqueTokens,
  useSendSavingsAccount,
  useTransactionConfirmation,
  useUpdateAssetOnchainBalance,
  useWallets,
} from '@rainbow-me/hooks';
import { ETH_ADDRESS } from '@rainbow-me/references/addresses';
import Routes from '@rainbow-me/routes';
import { borders } from '@rainbow-me/styles';
import { deviceUtils, gasUtils } from '@rainbow-me/utils';
import logger from 'logger';

const sheetHeight = deviceUtils.dimensions.height - (android ? 30 : 10);
const statusBarHeight = getStatusBarHeight(true);

const Container = styled.View`
  background-color: ${({ theme: { colors } }) => colors.transparent};
  flex: 1;
  padding-top: ${isNativeStackAvailable ? 0 : statusBarHeight};
  width: 100%;
`;

const SheetContainer = styled(Column).attrs({
  align: 'center',
  flex: 1,
})`
  ${borders.buildRadius('top', isNativeStackAvailable ? 0 : 16)};
  background-color: ${({ theme: { colors } }) => colors.white};
  height: ${isNativeStackAvailable || android ? sheetHeight : '100%'};
  width: 100%;
`;

const KeyboardSizeView = styled(KeyboardArea)`
  width: 100%;
  background-color: ${({ showAssetForm, theme: { colors } }) =>
    showAssetForm ? colors.lighterGrey : colors.white};
`;

const useSendSheetScreen = () => {
  const dispatch = useDispatch();
  const { isTinyPhone } = useDimensions();
  const { navigate, addListener } = useNavigation();
  const { params } = useRoute();
  const { dataAddNewTransaction } = useTransactionConfirmation();
  const updateAssetOnchainBalanceIfNeeded = useUpdateAssetOnchainBalance();
  const {
    allAssets,
    depots: [depot],
  } = useAccountAssets();

  const depotAssets = useMemo(
    () => (depot ? reshapeDepotTokensToAssets(depot) : []),
    [depot]
  );

  const isDepot = !!params?.asset?.tokenAddress;

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
  const isDismissing = useRef(false);

  const recipientFieldRef = useRef();

  useEffect(() => {
    if (ios) {
      return;
    }
    dismissingScreenListener.current = () => {
      Keyboard.dismiss();
      isDismissing.current = true;
    };
    const unsubscribe = addListener(
      'transitionEnd',
      ({ data: { closing } }) => {
        if (!closing && isDismissing.current) {
          isDismissing.current = false;
          recipientFieldRef?.current?.focus();
        }
      }
    );
    return () => {
      unsubscribe();
      dismissingScreenListener.current = undefined;
    };
  }, [addListener]);
  const { contacts, onRemoveContact, filteredContacts } = useContacts();
  const { sendableUniqueTokens } = useSendableUniqueTokens();
  const {
    accountAddress,
    nativeCurrency,
    nativeCurrencySymbol,
    network,
  } = useAccountSettings();

  const savings = useSendSavingsAccount();
  const fetchData = useRefreshAccountData();
  const { hiddenCoins, pinnedCoins } = useCoinListEditOptions();

  const [amountDetails, setAmountDetails] = useState({
    assetAmount: '',
    isSufficientBalance: false,
    nativeAmount: '',
  });
  const [currentInput, setCurrentInput] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [selected, setSelected] = useState({});
  const { maxInputBalance, updateMaxInputBalance } = useMaxInputBalance();

  const showEmptyState = !isValidAddress;
  const showAssetList = isValidAddress && isEmpty(selected);
  const showAssetForm = isValidAddress && !isEmpty(selected);
  const prevSelectedGasPrice = usePrevious(selectedGasPrice);

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
      (isNativeToken(selected?.symbol, network) || isDepot) &&
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
    isDepot,
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

  const sendUpdateSelected = useCallback(
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
        // Since we don't trust the balance from zerion,
        // let's hit the blockchain and update it
        updateAssetOnchainBalanceIfNeeded(
          newSelected,
          accountAddress,
          updatedAsset => {
            // set selected asset with new balance
            setSelected(updatedAsset);
            // Update selected to recalculate the maxInputAmount
            sendUpdateSelected(updatedAsset);
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
      analytics.track('Changed native currency input in Send flow');
    },
    [maxInputBalance, selected]
  );

  const sendMaxBalance = useCallback(async () => {
    const newBalanceAmount = await updateMaxInputBalance(selected);
    sendUpdateAssetAmount(newBalanceAmount);
  }, [selected, sendUpdateAssetAmount, updateMaxInputBalance]);

  const onChangeAssetAmount = useCallback(
    newAssetAmount => {
      if (isString(newAssetAmount)) {
        sendUpdateAssetAmount(newAssetAmount);
        analytics.track('Changed token input in Send flow');
      }
    },
    [sendUpdateAssetAmount]
  );

  const { selectedWallet } = useWallets();

  const sendTokenFromDepot = useCallback(async () => {
    const safes = await getSafesInstance({ selectedWallet, network });

    return safes.sendTokens(
      depot.address,
      selected.address,
      recipient,
      toWei(amountDetails.assetAmount),
      undefined,
      undefined,
      undefined,
      { from: accountAddress }
    );
  }, [
    accountAddress,
    amountDetails.assetAmount,
    depot,
    network,
    recipient,
    selected.address,
    selectedWallet,
  ]);

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
    if (selected?.address !== ETH_ADDRESS && !isDepot) {
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
      if (isDepot) {
        const txResult = await sendTokenFromDepot();

        const { transactionHash } = txResult;

        if (!isEmpty(transactionHash)) {
          submitSuccess = true;
          txDetails.hash = transactionHash;
          await dispatch(dataAddNewTransaction(txDetails));
        }
      } else {
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
      }
    } catch (error) {
      const errorMessage = error.toString();

      if (isDepot && errorMessage) {
        Alert({
          message: errorMessage,
          title: 'An error ocurred',
        });
      }

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
    isDepot,
    isSufficientGas,
    isValidAddress,
    network,
    recipient,
    selected,
    selectedGasPrice,
    sendTokenFromDepot,
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
      const submitSuccessful = await onSubmit();
      analytics.track('Sent transaction', {
        assetName: selected?.name || '',
        assetType: selected?.type || '',
        isRecepientENS: toLower(recipient.slice(-4)) === '.eth',
      });
      if (submitSuccessful) {
        navigate(Routes.PROFILE_SCREEN);
      }
    } catch (error) {
      setIsAuthorizing(false);
    }
  }, [amountDetails.assetAmount, navigate, onSubmit, recipient, selected]);

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

  const onPress = useCallback(() => {
    if (isIphoneX()) {
      submitTransaction();
    } else {
      onPressTransactionSpeed(submitTransaction);
    }
  }, [onPressTransactionSpeed, submitTransaction]);

  const onResetAssetSelection = useCallback(() => {
    analytics.track('Reset asset selection in Send flow');
    sendUpdateSelected({});
  }, [sendUpdateSelected]);

  const onChangeInput = useCallback(event => {
    setCurrentInput(event);
    setRecipient(event);
  }, []);

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

  const assetOverride = useMemo(
    () =>
      isDepot ? reshapeSingleDepotTokenToAsset(params?.asset) : params?.asset,
    [isDepot, params.asset]
  );

  const prevAssetOverride = usePrevious(assetOverride);

  useEffect(() => {
    if (assetOverride && assetOverride !== prevAssetOverride) {
      isDepot ? setSelected(assetOverride) : sendUpdateSelected(assetOverride);
    }
  }, [assetOverride, isDepot, prevAssetOverride, sendUpdateSelected]);

  const recipientOverride = params?.address;

  useEffect(() => {
    if (recipientOverride && !recipient) {
      setRecipient(recipientOverride);
    }
  }, [recipient, recipientOverride]);

  const checkAddress = useCallback(async () => {
    const validAddress = await checkIsValidAddressOrDomain(recipient);
    setIsValidAddress(validAddress);
  }, [recipient]);

  useEffect(() => {
    checkAddress();
  }, [checkAddress]);

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
    contacts,
    isValidAddress,
    onChangeInput,
    handleFocus,
    setRecipient,
    triggerFocus,
    recipient,
    recipientFieldRef,
    onRemoveContact,
    showAssetList,
    showEmptyState,
    filteredContacts,
    currentInput,
    allAssets: isDepot ? depotAssets : allAssets,
    fetchData,
    hiddenCoins,
    nativeCurrency,
    network,
    sendUpdateSelected,
    pinnedCoins,
    savings,
    sendableUniqueTokens,
    showAssetForm,
    amountDetails,
    isAuthorizing,
    isSufficientGas,
    onPress,
    isTinyPhone,
    onChangeAssetAmount,
    onChangeNativeAmount,
    onResetAssetSelection,
    selected,
    sendMaxBalance,
    selectedGasPrice,
    nativeCurrencySymbol,
    onPressTransactionSpeed,
    isDepot,
  };
};

export default function SendSheet(props) {
  const {
    contacts,
    isValidAddress,
    onChangeInput,
    handleFocus,
    setRecipient,
    triggerFocus,
    recipient,
    recipientFieldRef,
    onRemoveContact,
    showAssetList,
    showEmptyState,
    filteredContacts,
    currentInput,
    allAssets,
    fetchData,
    hiddenCoins,
    nativeCurrency,
    network,
    sendUpdateSelected,
    pinnedCoins,
    savings,
    sendableUniqueTokens,
    showAssetForm,
    amountDetails,
    isAuthorizing,
    isSufficientGas,
    onPress,
    isTinyPhone,
    onChangeAssetAmount,
    onChangeNativeAmount,
    onResetAssetSelection,
    selected,
    sendMaxBalance,
    selectedGasPrice,
    nativeCurrencySymbol,
    onPressTransactionSpeed,
    isDepot,
  } = useSendSheetScreen();

  return (
    <Container>
      {ios && <StatusBar barStyle="light-content" />}
      <SheetContainer>
        <SendHeader
          contacts={contacts}
          isValidAddress={isValidAddress}
          onChangeAddressInput={onChangeInput}
          onFocus={handleFocus}
          onPressPaste={setRecipient}
          onRefocusInput={triggerFocus}
          recipient={recipient}
          recipientFieldRef={recipientFieldRef}
          removeContact={onRemoveContact}
          showAssetList={showAssetList}
        />
        {showEmptyState && (
          <SendContactList
            contacts={filteredContacts}
            currentInput={currentInput}
            onPressContact={setRecipient}
            removeContact={onRemoveContact}
          />
        )}
        {showAssetList && (
          <SendAssetList
            allAssets={allAssets}
            fetchData={fetchData}
            hiddenCoins={hiddenCoins}
            nativeCurrency={nativeCurrency}
            network={network}
            onSelectAsset={sendUpdateSelected}
            pinnedCoins={pinnedCoins}
            savings={savings}
            uniqueTokens={sendableUniqueTokens}
          />
        )}
        {showAssetForm && (
          <SendAssetForm
            {...props}
            allAssets={allAssets}
            assetAmount={amountDetails.assetAmount}
            buttonRenderer={
              <SendButton
                {...props}
                assetAmount={amountDetails.assetAmount}
                isAuthorizing={isAuthorizing}
                isSufficientBalance={amountDetails.isSufficientBalance}
                isSufficientGas={isSufficientGas}
                onPress={onPress}
                smallButton={isTinyPhone}
                testID="send-sheet-confirm"
              />
            }
            nativeAmount={amountDetails.nativeAmount}
            nativeCurrency={nativeCurrency}
            onChangeAssetAmount={onChangeAssetAmount}
            onChangeNativeAmount={onChangeNativeAmount}
            onFocus={handleFocus}
            onResetAssetSelection={onResetAssetSelection}
            selected={selected}
            sendMaxBalance={sendMaxBalance}
            txSpeedRenderer={
              isIphoneX() &&
              !isDepot && (
                <SendTransactionSpeed
                  gasPrice={selectedGasPrice}
                  nativeCurrencySymbol={nativeCurrencySymbol}
                  onPressTransactionSpeed={onPressTransactionSpeed}
                />
              )
            }
          />
        )}
        {android && showAssetForm ? (
          <KeyboardSizeView showAssetForm={showAssetForm} />
        ) : null}
      </SheetContainer>
    </Container>
  );
}
