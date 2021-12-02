import { useState, useEffect, useCallback, useMemo } from 'react';
import { LayoutAnimation, InteractionManager } from 'react-native';
import { NativeCurrency } from '@cardstack/cardpay-sdk/sdk/currencies';
import { getBlockTimestamp, mapPrepaidTxToNavigationParams } from './helpers';
import usePayment from '@cardstack/redux/hooks/usePayment';
import {
  handleAlertError,
  usePaymentMerchantUniversalLink,
} from '@cardstack/hooks/merchant/usePaymentMerchantUniversalLink';
import { useMerchantInfoFromDID } from '@cardstack/hooks/merchant/useMerchantInfoFromDID';
import { MerchantInformation, PrepaidCardType } from '@cardstack/types';
import {
  convertSpendForBalanceDisplay,
  nativeCurrencyToAmountInSpend,
} from '@cardstack/utils';
import { useNativeCurrencyAndConversionRates } from '@rainbow-me/redux/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import RainbowRoutes from '@rainbow-me/navigation/routesNames';
import { useAccountSettings, useWallets } from '@rainbow-me/hooks';
import logger from 'logger';
import { usePayMerchantMutation } from '@cardstack/services';
import { useLoadingOverlay } from '@cardstack/navigation';

export const PAY_STEP = {
  EDIT_AMOUNT: 'EDIT_AMOUNT',
  CHOOSE_PREPAID_CARD: 'CHOOSE_PREPAID_CARD',
  CONFIRMATION: 'CONFIRMATION',
} as const;

type Step = keyof typeof PAY_STEP;

const layoutAnimation = () => {
  LayoutAnimation.configureNext(
    LayoutAnimation.create(
      350,
      LayoutAnimation.Types.easeIn,
      LayoutAnimation.Properties.opacity
    )
  );
};

interface PayMerchantRequestParams {
  spendAmount: number;
  merchantInfoDID?: MerchantInformation;
  selectedPrepaidCard?: PrepaidCardType;
  merchantAddress: string;
  qrCodeNetwork: string;
}

const usePayMerchantRequest = ({
  spendAmount,
  merchantInfoDID,
  selectedPrepaidCard,
  merchantAddress,
  qrCodeNetwork,
}: PayMerchantRequestParams) => {
  const { navigate } = useNavigation();

  const { accountAddress } = useAccountSettings();
  const { selectedWallet } = useWallets();

  const [
    payMerchant,
    { data: receipt, isSuccess, isLoading: isLoadingTx, isError, error },
  ] = usePayMerchantMutation();

  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  const [
    accountCurrency,
    currencyConversionRates,
  ] = useNativeCurrencyAndConversionRates();

  const payMerchantRequest = useCallback(() => {
    showLoadingOverlay({
      title: 'Processing Transaction',
      subTitle: `This will take approximately\n10-15 seconds`,
    });

    payMerchant({
      selectedWallet,
      network: qrCodeNetwork,
      merchantAddress,
      prepaidCardAddress: selectedPrepaidCard?.address || '',
      spendAmount,
      accountAddress,
    });
  }, [
    spendAmount,
    selectedPrepaidCard,
    showLoadingOverlay,
    payMerchant,
    selectedWallet,
    qrCodeNetwork,
    merchantAddress,
    accountAddress,
  ]);

  const onPayMerchantSuccess = useCallback(async () => {
    const { nativeBalanceDisplay } = convertSpendForBalanceDisplay(
      String(spendAmount),
      accountCurrency,
      currencyConversionRates,
      true
    );

    const timestamp = await getBlockTimestamp(receipt.blockNumber);

    dismissLoadingOverlay();

    // Navigate to Transaction screen
    navigate(RainbowRoutes.PROFILE_SCREEN);

    // Wait goBack action to navigate
    InteractionManager.runAfterInteractions(() => {
      navigate(
        RainbowRoutes.EXPANDED_ASSET_SHEET,
        mapPrepaidTxToNavigationParams({
          merchantInfo: merchantInfoDID,
          spendAmount,
          nativeBalanceDisplay,
          timestamp,
          transactionHash: receipt.transactionHash,
          prepaidCardAddress: receipt.from,
          prepaidCardCustomization: selectedPrepaidCard?.cardCustomization,
        })
      );
    });
  }, [
    spendAmount,
    accountCurrency,
    currencyConversionRates,
    receipt,
    dismissLoadingOverlay,
    navigate,
    merchantInfoDID,
    selectedPrepaidCard,
  ]);

  useEffect(() => {
    if (isSuccess && receipt) {
      onPayMerchantSuccess();
    }
  }, [
    dismissLoadingOverlay,
    error,
    isError,
    isSuccess,
    onPayMerchantSuccess,
    receipt,
  ]);

  useEffect(() => {
    if (isError) {
      dismissLoadingOverlay();

      handleAlertError(
        'Something unexpected happened! Please try again. If this error persists please contact support@cardstack.com'
      );

      logger.sentry('Pay Merchant failed!', error);
    }
  }, [dismissLoadingOverlay, error, isError]);

  return { payMerchantRequest, isLoadingPayment: isLoadingTx };
};

export const usePayMerchant = () => {
  const { prepaidCards, isLoading, data } = usePaymentMerchantUniversalLink();

  const {
    infoDID = '',
    amount: initialAmount,
    currency: initialCurrency,
    merchantSafe: merchantAddress,
    qrCodeNetwork,
  } = data;

  const { paymentChangeCurrency, currency: nativeCurrency } = usePayment();
  // Initialize input amount's currency with the currency in merchant payment request link
  useEffect(() => {
    if (initialCurrency) {
      paymentChangeCurrency(initialCurrency);
    }
  }, [initialCurrency, paymentChangeCurrency]);

  const [selectedPrepaidCard, selectPrepaidCard] = useState<PrepaidCardType>();

  const [inputValue, setInputValue] = useState<string | undefined>(
    `${initialAmount ? initialAmount.toString() : 0}`
  );

  const hasMultipleCards = prepaidCards.length > 1;

  const initialStep = hasMultipleCards
    ? PAY_STEP.CHOOSE_PREPAID_CARD
    : PAY_STEP.EDIT_AMOUNT;

  const nextStep = hasMultipleCards
    ? PAY_STEP.CHOOSE_PREPAID_CARD
    : PAY_STEP.CONFIRMATION;

  const [payStep, setPayStep] = useState<Step>(initialStep);

  const {
    merchantInfoDID,
    isLoading: isLoadingMerchantInfo,
  } = useMerchantInfoFromDID(infoDID);

  const [
    accountCurrency,
    currencyConversionRates,
  ] = useNativeCurrencyAndConversionRates();

  // Updating in case first render selected is undefined
  useEffect(() => {
    if (!selectedPrepaidCard?.address && prepaidCards.length > 0) {
      selectPrepaidCard(prepaidCards[0]);
    }
  }, [prepaidCards, selectedPrepaidCard]);

  useEffect(() => {
    if (hasMultipleCards) {
      setPayStep(PAY_STEP.CHOOSE_PREPAID_CARD);
    }
  }, [hasMultipleCards]);

  // Updating amount when nav param change
  useEffect(() => {
    if (initialAmount) {
      setInputValue(initialAmount.toString());
    } else {
      setPayStep(PAY_STEP.EDIT_AMOUNT);
    }
  }, [initialAmount]);

  const spendAmount = useMemo(
    () =>
      nativeCurrencyToAmountInSpend(
        inputValue,
        currencyConversionRates[nativeCurrency]
      ),
    [currencyConversionRates, inputValue, nativeCurrency]
  );

  const { payMerchantRequest, isLoadingPayment } = usePayMerchantRequest({
    spendAmount,
    selectedPrepaidCard,
    merchantAddress,
    merchantInfoDID,
    qrCodeNetwork,
  });

  const onConfirm = useCallback(() => {
    // if have multiple prepaid cards, prepaid cards that has not enough balance should not be selected
    if (spendAmount > (selectedPrepaidCard?.spendFaceValue || 0)) {
      handleAlertError(
        'Selected prepaid card does not have enough balance to pay merchant.'
      );

      return;
    }

    payMerchantRequest();
  }, [spendAmount, selectedPrepaidCard, payMerchantRequest]);

  const onSelectPrepaidCard = useCallback(
    (prepaidCardItem: PrepaidCardType) => {
      selectPrepaidCard(prepaidCardItem);
    },
    []
  );

  const onStepChange = useCallback(
    (step: Step) => () => {
      layoutAnimation();
      setPayStep(step);
    },
    []
  );

  const onCancelConfirmation = useCallback(onStepChange(initialStep), [
    onStepChange,
  ]);

  const onAmountNext = useCallback(onStepChange(nextStep), [onStepChange]);

  const txSheetData = useMemo(
    () => ({
      ...data,
      spendAmount,
      currency:
        nativeCurrency === NativeCurrency.SPD
          ? accountCurrency
          : nativeCurrency,
      prepaidCard: selectedPrepaidCard?.address,
    }),
    [accountCurrency, data, nativeCurrency, selectedPrepaidCard, spendAmount]
  );

  return {
    merchantInfoDID,
    inputValue,
    nativeCurrency,
    selectedPrepaidCard,
    spendAmount,
    payStep,
    txSheetData,
    prepaidCards,
    isLoading,
    onConfirmLoading: isLoadingPayment,
    hasMultipleCards,
    onConfirm,
    onStepChange,
    onSelectPrepaidCard,
    setInputValue,
    onCancelConfirmation,
    onAmountNext,
    isLoadingMerchantInfo,
  };
};
