import { useState, useEffect, useCallback, useMemo } from 'react';
import { TransactionReceipt } from 'web3-eth';
import { LayoutAnimation } from 'react-native';
import { getBlockTimestamp, mapPrepaidTxToNavigationParams } from './helpers';
import usePayment from '@cardstack/redux/hooks/usePayment';
import { usePaymentMerchantUniversalLink } from '@cardstack/hooks/merchant/usePaymentMerchantUniversalLink';
import { useMerchantInfoFromDID } from '@cardstack/hooks/merchant/useMerchantInfoFromDID';
import { PrepaidCardType } from '@cardstack/types';
import {
  convertSpendForBalanceDisplay,
  localCurrencyToAbsNum,
  nativeCurrencyToSpend,
} from '@cardstack/utils';
import {
  useNativeCurrencyAndConversionRates,
  usePaymentCurrencyAndConversionRates,
} from '@rainbow-me/redux/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import RainbowRoutes from '@rainbow-me/navigation/routesNames';

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

export const usePayMerchant = () => {
  const { navigate, goBack, canGoBack } = useNavigation();

  const {
    prepaidCards,
    onConfirm,
    isLoadingTx: onConfirmLoading,
    isLoading,
    data,
  } = usePaymentMerchantUniversalLink();

  const { infoDID = '', spendAmount: initialSpendAmount, currency } = data;

  const [selectedPrepaidCard, selectPrepaidCard] = useState<PrepaidCardType>();

  const [inputValue, setInputValue] = useState<string | undefined>(
    `${initialSpendAmount ? initialSpendAmount.toString() : 0}`
  );

  const [payStep, setPayStep] = useState<Step>(PAY_STEP.CHOOSE_PREPAID_CARD);

  const { merchantInfoDID } = useMerchantInfoFromDID(infoDID);
  const { paymentChangeCurrency } = usePayment();

  const [
    nativeCurrency,
    currencyConversionRates,
  ] = usePaymentCurrencyAndConversionRates();

  const [accountCurrency] = useNativeCurrencyAndConversionRates();

  useEffect(() => {
    if (currency) {
      paymentChangeCurrency(currency);
    }
  }, [currency, paymentChangeCurrency]);

  // Updating in case first render selected is undefined
  useEffect(() => {
    if (!selectedPrepaidCard?.address) {
      selectPrepaidCard(prepaidCards[0]);
    }
  }, [prepaidCards, selectedPrepaidCard]);

  // Updating amount when nav param change
  useEffect(() => {
    if (initialSpendAmount) {
      setInputValue(initialSpendAmount.toString());
    }
  }, [initialSpendAmount]);

  const spendAmount =
    currency === 'SPD'
      ? localCurrencyToAbsNum(`${inputValue || 0}`)
      : nativeCurrencyToSpend(
          inputValue,
          currencyConversionRates[nativeCurrency],
          true
        ).spendAmount;

  const onPayMerchantSuccess = useCallback(
    async (receipt: TransactionReceipt) => {
      const { nativeBalanceDisplay } = convertSpendForBalanceDisplay(
        inputValue ? localCurrencyToAbsNum(inputValue) : 0,
        accountCurrency,
        currencyConversionRates,
        true
      );

      const timestamp = await getBlockTimestamp(receipt.blockNumber);

      if (canGoBack()) {
        goBack();
      }

      // Wait goBack action to navigate
      setTimeout(() => {
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
      }, 1000);
    },
    [
      accountCurrency,
      canGoBack,
      currencyConversionRates,
      goBack,
      inputValue,
      merchantInfoDID,
      navigate,
      selectedPrepaidCard,
      spendAmount,
    ]
  );

  const onCustomConfirm = useCallback(() => {
    onConfirm(
      spendAmount,
      selectedPrepaidCard?.address || '',
      onPayMerchantSuccess
    );
  }, [onConfirm, spendAmount, selectedPrepaidCard, onPayMerchantSuccess]);

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

  const txSheetData = useMemo(
    () => ({
      ...data,
      spendAmount,
      currency: nativeCurrency === 'SPD' ? currency : nativeCurrency,
      prepaidCard: selectedPrepaidCard?.address,
    }),
    [currency, data, nativeCurrency, selectedPrepaidCard, spendAmount]
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
    onConfirmLoading,
    onConfirm: onCustomConfirm,
    onStepChange,
    onSelectPrepaidCard,
    setInputValue,
  };
};
