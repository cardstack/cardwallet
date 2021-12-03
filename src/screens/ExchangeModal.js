import { useRoute } from '@react-navigation/native';
import { get } from 'lodash';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Keyboard } from 'react-native';
import Animated, { Extrapolate } from 'react-native-reanimated';
import { useAndroidBackHandler } from 'react-navigation-backhandler';
import { useDispatch } from 'react-redux';
import { interpolate } from '../components/animations';
import {
  ConfirmExchangeButton,
  ExchangeInputField,
  ExchangeModalHeader,
  ExchangeOutputField,
  SlippageWarning,
} from '../components/exchange';
import { FloatingPanel, FloatingPanels } from '../components/floating-panels';
import { GasSpeedButton } from '../components/gas';
import { KeyboardFixedOpenLayout } from '../components/layout';
import { dismissingScreenListener } from '../utils/modalUtils';
import { CenteredContainer, Container } from '@cardstack/components';
import ExchangeModalTypes from '@rainbow-me/helpers/exchangeModalTypes';
import isKeyboardOpen from '@rainbow-me/helpers/isKeyboardOpen';
import {
  useAccountSettings,
  useBlockPolling,
  useGas,
  useMaxInputBalance,
  usePrevious,
  useSwapDetails,
  useSwapInputOutputTokens,
  useSwapInputRefs,
  useSwapInputs,
  useSwapInputValues,
  useUniswapCurrencies,
  useUniswapMarketDetails,
} from '@rainbow-me/hooks';
import { loadWallet } from '@rainbow-me/model/wallet';
import { useNavigation } from '@rainbow-me/navigation/Navigation';
import { executeRap } from '@rainbow-me/raps';
import { multicallClearState } from '@rainbow-me/redux/multicall';
import { swapClearState } from '@rainbow-me/redux/swap';
import { ethUnits } from '@rainbow-me/references';
import Routes from '@rainbow-me/routes';
import { position } from '@rainbow-me/styles';
import { backgroundTask, isNewValueForPath } from '@rainbow-me/utils';
import logger from 'logger';

const AnimatedFloatingPanels = Animated.createAnimatedComponent(FloatingPanels);
const Wrapper = ios ? KeyboardFixedOpenLayout : Fragment;

export default function ExchangeModal({
  createRap,
  cTokenBalance,
  defaultInputAsset,
  estimateRap,
  inputHeaderTitle,
  showOutputField,
  supplyBalanceUnderlying,
  testID,
  type,
  underlyingPrice,
}) {
  const {
    navigate,
    setParams,
    dangerouslyGetParent,
    addListener,
  } = useNavigation();
  const {
    params: { tabTransitionPosition },
  } = useRoute();

  const isDeposit = type === ExchangeModalTypes.deposit;
  const isWithdrawal = type === ExchangeModalTypes.withdrawal;

  const defaultGasLimit = isDeposit
    ? ethUnits.basic_deposit
    : isWithdrawal
    ? ethUnits.basic_withdrawal
    : ethUnits.basic_swap;

  const dispatch = useDispatch();

  const {
    isSufficientGas,
    selectedGasPrice,
    startPollingGasPrices,
    stopPollingGasPrices,
    updateDefaultGasLimit,
    updateTxFee,
  } = useGas();
  const { initWeb3Listener, stopWeb3Listener } = useBlockPolling();
  const { nativeCurrency } = useAccountSettings();
  const prevSelectedGasPrice = usePrevious(selectedGasPrice);
  const { maxInputBalance, updateMaxInputBalance } = useMaxInputBalance();

  const { areTradeDetailsValid, slippage, tradeDetails } = useSwapDetails();

  const [isAuthorizing, setIsAuthorizing] = useState(false);

  useAndroidBackHandler(() => {
    navigate(Routes.WALLET_SCREEN);
    return true;
  });

  const {
    defaultInputAddress,
    navigateToSelectInputCurrency,
    navigateToSelectOutputCurrency,
    previousInputCurrency,
  } = useUniswapCurrencies({
    defaultInputAsset,
    inputHeaderTitle,
    isDeposit,
    isWithdrawal,
    type,
    underlyingPrice,
  });

  const { inputCurrency, outputCurrency } = useSwapInputOutputTokens();

  const {
    handleFocus,
    inputFieldRef,
    lastFocusedInputHandle,
    nativeFieldRef,
    outputFieldRef,
  } = useSwapInputRefs();

  const {
    updateInputAmount,
    updateNativeAmount,
    updateOutputAmount,
  } = useSwapInputs({
    isWithdrawal,
    maxInputBalance,
    nativeFieldRef,
    supplyBalanceUnderlying,
  });

  const {
    inputAmount,
    inputAmountDisplay,
    isSufficientBalance,
    nativeAmount,
    isMax,
    outputAmount,
    outputAmountDisplay,
  } = useSwapInputValues();

  const isDismissing = useRef(false);
  useEffect(() => {
    if (ios) {
      return;
    }
    dismissingScreenListener.current = () => {
      Keyboard.dismiss();
      isDismissing.current = true;
    };
    const unsubscribe = (
      dangerouslyGetParent()?.dangerouslyGetParent()?.addListener || addListener
    )('transitionEnd', ({ data: { closing } }) => {
      if (!closing && isDismissing.current) {
        isDismissing.current = false;
        lastFocusedInputHandle?.current?.focus();
      }
    });
    return () => {
      unsubscribe();
      dismissingScreenListener.current = undefined;
    };
  }, [addListener, dangerouslyGetParent, lastFocusedInputHandle]);

  const handleCustomGasBlur = useCallback(() => {
    lastFocusedInputHandle?.current?.focus();
  }, [lastFocusedInputHandle]);

  // Calculate market details
  const { isSufficientLiquidity } = useUniswapMarketDetails({
    defaultInputAddress,
    inputFieldRef,
    isDeposit,
    isWithdrawal,
    maxInputBalance,
    outputFieldRef,
    updateInputAmount,
    updateOutputAmount,
  });

  const updateGasLimit = useCallback(async () => {
    try {
      const gasLimit = await estimateRap({
        inputAmount,
        inputCurrency,
        outputAmount,
        outputCurrency,
        tradeDetails,
      });
      if (inputCurrency && outputCurrency) {
        updateTxFee(gasLimit);
      }
    } catch (error) {
      updateTxFee(defaultGasLimit);
    }
  }, [
    defaultGasLimit,
    estimateRap,
    inputAmount,
    inputCurrency,
    outputAmount,
    outputCurrency,
    tradeDetails,
    updateTxFee,
  ]);

  // Update gas limit
  useEffect(() => {
    updateGasLimit();
  }, [updateGasLimit]);

  useEffect(() => {
    return () => {
      dispatch(multicallClearState());
      dispatch(swapClearState());
    };
  }, [dispatch]);

  // Set default gas limit
  useEffect(() => {
    setTimeout(() => {
      updateTxFee(defaultGasLimit);
    }, 1000);
  }, [defaultGasLimit, updateTxFee]);

  const clearForm = useCallback(() => {
    logger.log('[exchange] - clear form');
    inputFieldRef?.current?.clear();
    nativeFieldRef?.current?.clear();
    outputFieldRef?.current?.clear();
    updateInputAmount();
    updateMaxInputBalance();
  }, [
    inputFieldRef,
    nativeFieldRef,
    outputFieldRef,
    updateInputAmount,
    updateMaxInputBalance,
  ]);

  // Clear form and reset max input balance on new input currency
  useEffect(() => {
    if (isNewValueForPath(inputCurrency, previousInputCurrency, 'address')) {
      clearForm();
      updateMaxInputBalance(inputCurrency);
    }
  }, [clearForm, inputCurrency, previousInputCurrency, updateMaxInputBalance]);

  // Recalculate max input balance when gas price changes if input currency is ETH
  useEffect(() => {
    if (
      inputCurrency?.address === 'eth' &&
      get(prevSelectedGasPrice, 'txFee.value.amount', 0) !==
        get(selectedGasPrice, 'txFee.value.amount', 0)
    ) {
      updateMaxInputBalance(inputCurrency);
    }
  }, [
    inputCurrency,
    prevSelectedGasPrice,
    selectedGasPrice,
    updateMaxInputBalance,
  ]);

  // Liten to gas prices, Uniswap reserves updates
  useEffect(() => {
    updateDefaultGasLimit(defaultGasLimit);
    startPollingGasPrices();
    initWeb3Listener();
    return () => {
      stopPollingGasPrices();
      stopWeb3Listener();
    };
  }, [
    defaultGasLimit,
    initWeb3Listener,
    startPollingGasPrices,
    stopPollingGasPrices,
    stopWeb3Listener,
    updateDefaultGasLimit,
  ]);

  // Update input amount when max is set and the max input balance changed
  useEffect(() => {
    if (isMax) {
      let maxBalance = maxInputBalance;
      inputFieldRef?.current?.blur();
      if (isWithdrawal) {
        maxBalance = supplyBalanceUnderlying;
      }
      updateInputAmount(maxBalance, maxBalance, true, true);
    }
  }, [
    inputFieldRef,
    isMax,
    isWithdrawal,
    maxInputBalance,
    supplyBalanceUnderlying,
    updateInputAmount,
  ]);

  const isSlippageWarningVisible =
    isSufficientBalance && !!inputAmount && !!outputAmount;

  const handlePressMaxBalance = useCallback(async () => {
    let maxBalance = maxInputBalance;
    if (isWithdrawal) {
      maxBalance = supplyBalanceUnderlying;
    }

    return updateInputAmount(maxBalance, maxBalance, true, true);
  }, [
    isWithdrawal,
    maxInputBalance,
    supplyBalanceUnderlying,
    updateInputAmount,
  ]);

  const handleSubmit = useCallback(() => {
    backgroundTask.execute(async () => {
      setIsAuthorizing(true);
      try {
        const wallet = await loadWallet();
        if (!wallet) {
          setIsAuthorizing(false);
          logger.sentry(`aborting ${type} due to missing wallet`);
          return;
        }

        setIsAuthorizing(false);
        const callback = () => {
          setParams({ focused: false });
          navigate(Routes.PROFILE_SCREEN);
        };
        const rap = await createRap({
          callback,
          inputAmount: isWithdrawal && isMax ? cTokenBalance : inputAmount,
          inputCurrency,
          isMax,
          outputAmount,
          outputCurrency,
          selectedGasPrice,
          tradeDetails,
        });
        logger.log('[exchange - handle submit] rap', rap);
        await executeRap(wallet, rap);
        logger.log('[exchange - handle submit] executed rap!');
      } catch (error) {
        setIsAuthorizing(false);
        logger.log('[exchange - handle submit] error submitting swap', error);
        setParams({ focused: false });
        navigate(Routes.WALLET_SCREEN);
      }
    });
  }, [
    type,
    outputCurrency,
    createRap,
    isWithdrawal,
    isMax,
    cTokenBalance,
    inputAmount,
    inputCurrency,
    outputAmount,
    selectedGasPrice,
    tradeDetails,
    setParams,
    navigate,
  ]);

  const keyboardDidHideListener = useRef(null);

  const navigateToSwapDetailsModal = useCallback(() => {
    android && Keyboard.dismiss();
    const lastFocusedInputHandleTemporary = lastFocusedInputHandle.current;
    android && (lastFocusedInputHandle.current = null);
    inputFieldRef?.current?.blur();
    outputFieldRef?.current?.blur();
    nativeFieldRef?.current?.blur();
    const internalNavigate = () => {
      android && keyboardDidHideListener.current?.remove();
      setParams({ focused: false });
      navigate(Routes.SWAP_DETAILS_SCREEN, {
        restoreFocusOnSwapModal: () => {
          android &&
            (lastFocusedInputHandle.current = lastFocusedInputHandleTemporary);
          setParams({ focused: true });
        },
        type: 'swap_details',
      });
    };
    ios || !isKeyboardOpen()
      ? internalNavigate()
      : (keyboardDidHideListener.current = Keyboard.addListener(
          'keyboardDidHide',
          internalNavigate
        ));
  }, [
    inputFieldRef,
    lastFocusedInputHandle,
    nativeFieldRef,
    navigate,
    outputFieldRef,
    setParams,
  ]);

  const showDetailsButton = useMemo(() => {
    return (
      !(isDeposit || isWithdrawal) &&
      inputCurrency?.symbol &&
      outputCurrency?.symbol &&
      areTradeDetailsValid
    );
  }, [
    areTradeDetailsValid,
    inputCurrency,
    isDeposit,
    isWithdrawal,
    outputCurrency,
  ]);

  const showConfirmButton =
    isDeposit || isWithdrawal
      ? !!inputCurrency
      : !!inputCurrency && !!outputCurrency;

  const { colors } = useTheme();

  return (
    <Wrapper>
      <CenteredContainer
        {...(ios
          ? position.sizeAsObject('100%')
          : { style: { height: 500, top: 0 } })}
        backgroundColor={colors.transparent}
      >
        <AnimatedFloatingPanels
          margin={0}
          paddingTop={24}
          style={{
            opacity: android
              ? 1
              : interpolate(tabTransitionPosition, {
                  extrapolate: Extrapolate.CLAMP,
                  inputRange: [0, 0, 1],
                  outputRange: [1, 1, 0],
                }),
            transform: [
              {
                scale: android
                  ? 1
                  : interpolate(tabTransitionPosition, {
                      extrapolate: Animated.Extrapolate.CLAMP,
                      inputRange: [0, 0, 1],
                      outputRange: [1, 1, 0.9],
                    }),
              },
              {
                translateX: android
                  ? 0
                  : interpolate(tabTransitionPosition, {
                      extrapolate: Animated.Extrapolate.CLAMP,
                      inputRange: [0, 0, 1],
                      outputRange: [0, 0, -8],
                    }),
              },
            ],
          }}
        >
          <FloatingPanel
            overflow="hidden"
            paddingBottom={showOutputField ? 0 : 26}
            radius={39}
            testID={testID}
          >
            <Container paddingHorizontal={4}>
              <ExchangeModalHeader
                onPressDetails={navigateToSwapDetailsModal}
                showDetailsButton={showDetailsButton}
                testID={testID + '-header'}
                title={inputHeaderTitle}
              />

              <ExchangeInputField
                disableInputCurrencySelection={isWithdrawal}
                inputAmount={inputAmountDisplay}
                inputCurrencyAddress={inputCurrency?.address}
                inputCurrencySymbol={inputCurrency?.symbol}
                inputFieldRef={inputFieldRef}
                nativeAmount={nativeAmount}
                nativeCurrency={nativeCurrency}
                nativeFieldRef={nativeFieldRef}
                onFocus={handleFocus}
                onPressMaxBalance={handlePressMaxBalance}
                onPressSelectInputCurrency={navigateToSelectInputCurrency}
                setInputAmount={updateInputAmount}
                setNativeAmount={updateNativeAmount}
                testID={testID + '-input'}
              />
            </Container>
            <Container
              backgroundColor="backgroundGray"
              paddingHorizontal={4}
              position="relative"
            >
              {showOutputField && (
                <ExchangeOutputField
                  onFocus={handleFocus}
                  onPressSelectOutputCurrency={navigateToSelectOutputCurrency}
                  outputAmount={outputAmountDisplay}
                  outputCurrencyAddress={outputCurrency?.address}
                  outputCurrencySymbol={outputCurrency?.symbol}
                  outputFieldRef={outputFieldRef}
                  setOutputAmount={updateOutputAmount}
                  testID={testID + '-output'}
                />
              )}
            </Container>
          </FloatingPanel>
          {isSlippageWarningVisible && <SlippageWarning slippage={slippage} />}
          {showConfirmButton && (
            <Container
              flexShrink={0}
              paddingHorizontal={5}
              paddingTop={12}
              width="100%"
            >
              <ConfirmExchangeButton
                disabled={!Number(inputAmountDisplay)}
                isAuthorizing={isAuthorizing}
                isDeposit={isDeposit}
                isSufficientBalance={isSufficientBalance}
                isSufficientGas={isSufficientGas}
                isSufficientLiquidity={isSufficientLiquidity}
                onSubmit={handleSubmit}
                slippage={slippage}
                testID={testID + '-confirm'}
                type={type}
              />
            </Container>
          )}
          <GasSpeedButton
            dontBlur
            onCustomGasBlur={handleCustomGasBlur}
            testID={testID + '-gas'}
            type={type}
          />
        </AnimatedFloatingPanels>
      </CenteredContainer>
    </Wrapper>
  );
}
