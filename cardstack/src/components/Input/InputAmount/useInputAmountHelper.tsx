import {
  convertAmountToNativeDisplay,
  convertToSpend,
  convertStringToNumber,
  NativeCurrency,
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

  const { data: rates } = useGetExchangeRatesQuery({});

  const spendAmount = useMemo(() => {
    const isCurrencyUSD = paymentCurrency === NativeCurrency.USD;
    const usdRate = isCurrencyUSD ? 1 : rates?.[paymentCurrency] || 0;

    return convertToSpend(amountInNum, paymentCurrency, usdRate);
  }, [amountInNum, paymentCurrency, rates]);

  // input amount should be more than MIN_SPEND_AMOUNT (50)
  const isInvalid = useMemo(
    () => amountInNum > 0 && spendAmount < MIN_SPEND_AMOUNT,
    [amountInNum, spendAmount]
  );

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
