import React from 'react';
import {
  convertAmountToNativeDisplay,
  convertAmountAndPriceToNativeDisplay,
  spendToUsd,
  convertToSpend,
  convertStringToNumber,
  NativeCurrency,
} from '@cardstack/cardpay-sdk';
import { Container, Text, TextProps } from '@cardstack/components';
import { getAddressPreview } from '@cardstack/utils';

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
    paddingVertical={5}
    width="100%"
  >
    <Text size="body" weight="extraBold">
      Request Payment
    </Text>
    <Text
      color="blueText"
      weight="bold"
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
  >{`minimum ${
    convertAmountAndPriceToNativeDisplay(
      spendToUsd(MIN_SPEND_AMOUNT) || 0,
      currencyConversionRates[nativeCurrency],
      nativeCurrency
    ).display
  }`}</Text>
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
