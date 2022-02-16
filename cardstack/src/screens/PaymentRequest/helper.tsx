import React from 'react';
import {
  convertAmountToNativeDisplay,
  convertAmountAndPriceToNativeDisplay,
  spendToUsd,
  convertToSpend,
  convertStringToNumber,
  NativeCurrency,
} from '@cardstack/cardpay-sdk';
import { Container, Text, TextProps, Input } from '@cardstack/components';
import { colors } from '@cardstack/theme/colors';

export const MIN_SPEND_AMOUNT = 50;

export const MinInvalidAmountText = ({
  nativeCurrency,
  currencyConversionRates,
  ...textProps
}: {
  nativeCurrency: string;
  currencyConversionRates: {
    [key: string]: number;
  };
} & TextProps) => (
  <Text
    textAlign="center"
    textTransform="uppercase"
    fontSize={12}
    weight="bold"
    color="red"
    marginTop={1}
    {...textProps}
  >{`minimum ${
    convertAmountAndPriceToNativeDisplay(
      spendToUsd(MIN_SPEND_AMOUNT) || 0,
      currencyConversionRates[nativeCurrency],
      nativeCurrency
    ).display
  }`}</Text>
);

export const MemoTextInput = () => (
  <Container backgroundColor="grayCardBackground" borderRadius={5}>
    <Input
      multiline
      numberOfLines={4}
      minHeight={100}
      editable={false}
      placeholder="Memo (optional): Coming soon."
      placeholderTextColor={colors.darkGrayText}
      textAlignVertical="top"
      paddingHorizontal={2}
    />
  </Container>
);

export const useAmountConvertHelper = (
  inputValue: string | undefined,
  inputNativeCurrency: string,
  accountNativeCurrency: string,
  currencyConversionRates: {
    [key: string]: number;
  }
) => {
  const amountInNum: number = convertStringToNumber(inputValue || '0');
  const isSPDCurrency: boolean = inputNativeCurrency === NativeCurrency.SPD;

  const amountWithSymbol = isSPDCurrency
    ? convertAmountAndPriceToNativeDisplay(
        spendToUsd(amountInNum) || 0,
        currencyConversionRates[accountNativeCurrency],
        accountNativeCurrency
      ).display
    : convertAmountToNativeDisplay(amountInNum, inputNativeCurrency);

  const spendAmount = isSPDCurrency
    ? amountInNum
    : convertToSpend(
        convertStringToNumber(inputValue || '0'),
        inputNativeCurrency,
        currencyConversionRates[inputNativeCurrency]
      );

  // input amount should be more than MIN_SPEND_AMOUNT (50)
  const isInvalid = amountInNum > 0 && spendAmount < MIN_SPEND_AMOUNT;

  const canSubmit = Boolean(amountInNum && !isInvalid);

  return {
    amountInNum,
    amountWithSymbol,
    isInvalid,
    canSubmit,
  };
};
