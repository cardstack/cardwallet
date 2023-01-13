import { useNavigation } from '@react-navigation/native';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { LayoutAnimation, InteractionManager } from 'react-native';

import { useInputAmountHelper } from '@cardstack/components';
import { defaultErrorAlert } from '@cardstack/constants';
import { useMutationEffects, useSpendToNativeDisplay } from '@cardstack/hooks';
import { useMerchantInfoFromDID } from '@cardstack/hooks/merchant/useMerchantInfoFromDID';
import {
  handleAlertError,
  usePaymentMerchantUniversalLink,
} from '@cardstack/hooks/merchant/usePaymentMerchantUniversalLink';
import { Routes, useLoadingOverlay } from '@cardstack/navigation';
import { usePayMerchantMutation } from '@cardstack/services';
import { MerchantInformation, PrepaidCardType } from '@cardstack/types';

import { Alert } from '@rainbow-me/components/alerts';
import { useWallets } from '@rainbow-me/hooks';

import { getBlockTimestamp } from './helpers';

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
}

const usePayMerchantRequest = ({
  spendAmount,
  merchantInfoDID,
  selectedPrepaidCard,
  merchantAddress,
}: PayMerchantRequestParams) => {
  const { navigate } = useNavigation();

  const { accountAddress } = useWallets();

  const [
    payMerchant,
    { data: receipt, isSuccess, isLoading: isLoadingTx, isError },
  ] = usePayMerchantMutation();

  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  const { nativeBalanceDisplay } = useSpendToNativeDisplay({ spendAmount });

  const payMerchantRequest = useCallback(() => {
    showLoadingOverlay({
      title: 'Processing Transaction',
      subTitle: `This will take approximately\n10-15 seconds`,
    });

    payMerchant({
      merchantAddress,
      prepaidCardAddress: selectedPrepaidCard?.address || '',
      spendAmount,
      accountAddress,
    });
  }, [
    showLoadingOverlay,
    payMerchant,
    merchantAddress,
    selectedPrepaidCard,
    spendAmount,
    accountAddress,
  ]);

  const onPayMerchantSuccess = useCallback(async () => {
    if (!receipt) {
      return;
    }

    const timestamp = await getBlockTimestamp(receipt.blockNumber);

    dismissLoadingOverlay();

    // Navigate to Transaction screen
    navigate(Routes.HOME_SCREEN, { forceRefresh: true });

    // Wait goBack action to navigate
    InteractionManager.runAfterInteractions(() => {
      navigate(Routes.PAYMENT_CONFIRMATION_SHEET, {
        merchantInfo: merchantInfoDID,
        nativeBalanceDisplay,
        timestamp,
        transactionHash: receipt.transactionHash,
        merchantSafeAddress: merchantAddress,
        address: selectedPrepaidCard?.address,
        cardCustomization: selectedPrepaidCard?.cardCustomization,
      });
    });
  }, [
    receipt,
    dismissLoadingOverlay,
    navigate,
    merchantInfoDID,
    nativeBalanceDisplay,
    merchantAddress,
    selectedPrepaidCard,
  ]);

  useMutationEffects(
    useMemo(
      () => ({
        success: {
          status: isSuccess,
          callback: onPayMerchantSuccess,
        },
        error: {
          status: isError,
          callback: () => {
            dismissLoadingOverlay();

            Alert(defaultErrorAlert);
          },
        },
      }),
      [dismissLoadingOverlay, isError, isSuccess, onPayMerchantSuccess]
    )
  );

  return { payMerchantRequest, isLoadingPayment: isLoadingTx };
};

export const usePayMerchant = () => {
  const [selectedPrepaidCard, selectPrepaidCard] = useState<PrepaidCardType>();
  const [payStep, setPayStep] = useState<Step>();

  const {
    prepaidCards,
    isLoading,
    data: initialTxSheetData,
  } = usePaymentMerchantUniversalLink();

  const {
    infoDID = '',
    amount: initialAmount,
    currency: paymentLinkCurrency,
    merchantSafe: merchantAddress,
  } = initialTxSheetData;

  const {
    isInvalid,
    canSubmit,
    paymentCurrency,
    setPaymentCurrency,
    inputValue,
    setInputValue,
    spendAmount,
  } = useInputAmountHelper();

  // Initialize default values from deeplink
  useEffect(() => {
    paymentLinkCurrency && setPaymentCurrency(paymentLinkCurrency);

    setInputValue(initialAmount);
  }, [initialAmount, paymentLinkCurrency, setInputValue, setPaymentCurrency]);

  const firstCardInfo = useMemo(() => {
    const card = prepaidCards[0];

    const hasEnoughBalance =
      spendAmount && (card?.spendFaceValue || 0) > spendAmount;

    return {
      card,
      hasEnoughBalance,
    };
  }, [prepaidCards, spendAmount]);

  // Auto select card if it has balance
  useEffect(() => {
    const noCardSelected = !selectedPrepaidCard?.address;

    if (noCardSelected && firstCardInfo.hasEnoughBalance) {
      selectPrepaidCard(firstCardInfo.card);
    }
  }, [firstCardInfo, selectedPrepaidCard]);

  const {
    merchantInfoDID,
    isLoading: isLoadingMerchantInfo,
  } = useMerchantInfoFromDID(infoDID);

  const getPayStep = useMemo(() => {
    const hasMultipleCards = prepaidCards.length > 1;

    const hasEnoughBalance =
      (selectedPrepaidCard?.spendFaceValue || 0) > spendAmount;

    // if it has amount from deep link, or a valid amount to pay set
    // with multiple cards or with none card with enough balance
    const shouldChooseCard =
      (initialAmount || spendAmount) && (hasMultipleCards || !hasEnoughBalance);

    const canGoToConfirmation =
      hasEnoughBalance && selectedPrepaidCard && spendAmount;

    return shouldChooseCard
      ? PAY_STEP.CHOOSE_PREPAID_CARD
      : canGoToConfirmation
      ? PAY_STEP.CONFIRMATION
      : PAY_STEP.EDIT_AMOUNT;
  }, [initialAmount, prepaidCards.length, selectedPrepaidCard, spendAmount]);

  // Update initial step state after checking selectedPrepaidcard
  // If first card doesn't have balance we update anyways, bc it probably
  // means it has a single card with no sufficient funds
  useEffect(() => {
    if (
      !payStep &&
      !isLoading &&
      (selectedPrepaidCard || !firstCardInfo.hasEnoughBalance)
    ) {
      setPayStep(getPayStep);
    }
  }, [firstCardInfo, getPayStep, isLoading, payStep, selectedPrepaidCard]);

  const { payMerchantRequest, isLoadingPayment } = usePayMerchantRequest({
    spendAmount,
    selectedPrepaidCard,
    merchantAddress,
    merchantInfoDID,
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

  const onStepChange = useCallback(
    (step: Step) => () => {
      layoutAnimation();
      setPayStep(step);
    },
    []
  );

  const onCancelConfirmation = useCallback(
    () => onStepChange(PAY_STEP.CHOOSE_PREPAID_CARD),
    [onStepChange]
  );

  const onAmountNext = useCallback(() => onStepChange(getPayStep), [
    onStepChange,
    getPayStep,
  ]);

  const txSheetData = useMemo(
    () => ({
      ...initialTxSheetData,
      spendAmount,
      prepaidCard: selectedPrepaidCard?.address,
    }),
    [initialTxSheetData, selectedPrepaidCard, spendAmount]
  );

  return {
    merchantInfoDID,
    inputValue,
    selectedPrepaidCard,
    spendAmount,
    payStep,
    txSheetData,
    prepaidCards,
    isLoading,
    onConfirmLoading: isLoadingPayment,
    onConfirm,
    onStepChange,
    onSelectPrepaidCard: selectPrepaidCard,
    setInputValue,
    onCancelConfirmation,
    onAmountNext,
    isLoadingMerchantInfo,
    isInvalid,
    canSubmit,
    paymentCurrency,
    setPaymentCurrency,
  };
};
