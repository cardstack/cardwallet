import {
  usdToSpend,
  convertAmountFromNativeValue,
  formatCurrencyAmount,
  convertStringToNumber,
} from '@cardstack/cardpay-sdk';
import { NativeCurrency } from '@cardstack/cardpay-sdk/sdk/currencies';

export const getDollarsFromDai = (dai: number) => dai / 100;

export function formattedCurrencyToAbsNum(
  value?: string,
  noDecimal?: boolean
): number {
  if (!value) {
    return 0;
  }

  const result = Math.abs(parseFloat(value.replace(/,/g, '')));

  if (isNaN(result)) {
    return 0;
  }

  if (noDecimal) {
    return Math.floor(result);
  }

  return result;
}

// format amount for amount TextInput box experience
export function formatNative(value: string | undefined, currency = 'USD') {
  if (!value) {
    return '';
  }

  const noDecimal = currency === NativeCurrency.SPD;

  if (
    !noDecimal &&
    value.endsWith('.') &&
    (value.match(/\./g) || []).length === 1
  ) {
    return `${formattedCurrencyToAbsNum(value).toLocaleString('en-US', {
      currency,
      maximumFractionDigits: 20,
      maximumSignificantDigits: 20,
    })}.`;
  }

  if (!noDecimal && (value.match(/\./g) || []).length === 1) {
    const decimalStrings = value.split('.');
    return `${formattedCurrencyToAbsNum(decimalStrings[0]).toLocaleString(
      'en-US'
    )}.${decimalStrings[1].replace(/\D/g, '')}`;
  }

  return `${formattedCurrencyToAbsNum(value, noDecimal).toLocaleString(
    'en-US',
    {
      currency,
      maximumFractionDigits: 20,
      maximumSignificantDigits: 20,
    }
  )}`;
}

export const nativeCurrencyToAmountInSpend = (
  amount: string | undefined,
  nativeCurrencyRate: number
): number => {
  return amount
    ? convertStringToNumber(
        convertAmountFromNativeValue(
          usdToSpend(formattedCurrencyToAbsNum(amount)) || 0,
          nativeCurrencyRate,
          0
        )
      )
    : 0;
};

export const nativeCurrencyToSpend = (
  amount: string | undefined,
  nativeCurrencyRate: number,
  includeSuffix?: boolean
) => {
  const spendAmount = nativeCurrencyToAmountInSpend(amount, nativeCurrencyRate);

  return {
    display: `§${formatCurrencyAmount(spendAmount, 0)}${
      includeSuffix ? ' SPEND' : ''
    }`,
    amount: spendAmount,
  };
};

export const decimalFixingConverter = (value: string) =>
  Number(value).toFixed(2).toString();
