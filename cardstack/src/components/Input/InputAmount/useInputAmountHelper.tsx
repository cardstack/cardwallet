import {
  convertAmountToNativeDisplay,
  convertToSpend,
  convertStringToNumber,
  NativeCurrency,
  spendToUsd,
} from '@cardstack/cardpay-sdk';
import { useMemo, useState } from 'react';

import { useGetExchangeRatesQuery } from '@cardstack/services/hub/hub-api';

import { useAccountSettings } from '@rainbow-me/hooks';

export const MIN_SPEND_AMOUNT = 50;

export const useInputAmountHelper = () => {
  const { nativeCurrency } = useAccountSettings();

  const [paymentCurrency, setPaymentCurrency] = useState<NativeCurrency>(
    nativeCurrency
  );

  const [inputValue, setInputValue] = useState<string>();

  const amountInNum = useMemo(() => convertStringToNumber(inputValue || '0'), [
    inputValue,
  ]);

  const amountWithSymbol = useMemo(
    () => convertAmountToNativeDisplay(amountInNum, paymentCurrency),
    [amountInNum, paymentCurrency]
  );

  const { data: rates } = useGetExchangeRatesQuery();

  const isCurrencyUSD = paymentCurrency === NativeCurrency.USD;
  const usdRate = isCurrencyUSD ? 1 : rates?.[paymentCurrency] || 0;

  const spendAmount = useMemo(
    () => convertToSpend(amountInNum, paymentCurrency, usdRate),
    [amountInNum, paymentCurrency, usdRate]
  );

  // input amount should be more than MIN_SPEND_AMOUNT (50)
  const isInvalid = useMemo(() => {
    const minSpendAmountToUSD = spendToUsd(MIN_SPEND_AMOUNT) || 0;

    const minNativeCurrencyAmount = usdRate * minSpendAmountToUSD;

    return amountInNum > 0 && amountInNum < minNativeCurrencyAmount;
  }, [amountInNum, usdRate]);

  const canSubmit = useMemo(() => Boolean(amountInNum && !isInvalid), [
    amountInNum,
    isInvalid,
  ]);

  return {
    amountInNum,
    amountWithSymbol,
    isInvalid,
    canSubmit,
    paymentCurrency,
    setPaymentCurrency,
    inputValue,
    setInputValue,
    spendAmount,
  };
};
