import React from 'react';
import {
  convertAmountToNativeDisplay,
  convertAmountAndPriceToNativeDisplay,
  spendToUsd,
} from '@cardstack/cardpay-sdk';
import { NativeCurrency } from '@cardstack/cardpay-sdk/sdk/currencies';
import { Container, Text, TextProps } from '@cardstack/components';
import {
  getAddressPreview,
  formattedCurrencyToAbsNum,
  formatNative,
  nativeCurrencyToSpend,
} from '@cardstack/utils';

export const MIN_SPEND_AMOUNT = 50;
export const RequestPaymentMerchantInfo = ({
  address,
  name,
}: {
  address: string;
  name: string | undefined;
}) => (
  <Container
    alignItems="center"
    flexDirection="column"
    paddingTop={5}
    width="100%"
  >
    <Text size="body" weight="extraBold">
      Request Payment
    </Text>
    <Text
      color="blueText"
      fontWeight="600"
      marginTop={3}
      size="smallest"
      textTransform="uppercase"
    >
      {name || ''}
    </Text>
    <Text fontFamily="RobotoMono-Regular" size="xs" weight="regular">
      {getAddressPreview(address)}
    </Text>
  </Container>
);

export const AmountInNativeCurrency = ({
  amountWithSymbol,
  textCenter = false,
  ...textProps
}: {
  amountWithSymbol: string;
  textCenter?: boolean;
} & TextProps) => (
  <Text
    color="blueText"
    fontFamily="OpenSans-Regular"
    fontSize={12}
    textAlign={textCenter ? 'center' : undefined}
    {...textProps}
  >
    {amountWithSymbol}
  </Text>
);

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
  >{`minimum ${MIN_SPEND_AMOUNT} spend (${
    convertAmountAndPriceToNativeDisplay(
      spendToUsd(MIN_SPEND_AMOUNT) || 0,
      currencyConversionRates[nativeCurrency],
      nativeCurrency
    ).display
  })`}</Text>
);

export const useAmountConvertHelper = (
  inputValue: string | undefined,
  inputNativeCurrency: string,
  accountNativeCurrency: string,
  currencyConversionRates: {
    [key: string]: number;
  }
) => {
  const amountInNum: number = formattedCurrencyToAbsNum(inputValue);
  const isSPDCurrency: boolean = inputNativeCurrency === NativeCurrency.SPD;

  const amountWithSymbol = isSPDCurrency
    ? `§${formatNative(`${amountInNum}`)} SPD`
    : convertAmountToNativeDisplay(amountInNum, inputNativeCurrency);

  const amountInAnotherCurrency = isSPDCurrency
    ? convertAmountAndPriceToNativeDisplay(
        spendToUsd(amountInNum) || 0,
        currencyConversionRates[accountNativeCurrency],
        accountNativeCurrency
      )
    : nativeCurrencyToSpend(
        inputValue,
        currencyConversionRates[inputNativeCurrency],
        true
      );

  // input amount should be more than MIN_SPEND_AMOUNT (50)
  const isInvalid =
    amountInNum > 0 &&
    (isSPDCurrency ? amountInNum : amountInAnotherCurrency.amount) <
      MIN_SPEND_AMOUNT;

  const canSubmit = Boolean(amountInNum && !isInvalid);

  return {
    amountInNum,
    amountWithSymbol,
    amountInAnotherCurrency,
    isInvalid,
    canSubmit,
  };
};
