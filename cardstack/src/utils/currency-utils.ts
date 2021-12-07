import {
  usdToSpend,
  convertAmountFromNativeValue,
  formatCurrencyAmount,
  convertStringToNumber,
  currencies,
  Currency,
} from '@cardstack/cardpay-sdk';
import { getCurrencies } from 'react-native-localize';

export const CURRENT_CURRENCY = getCurrencies()[0];

export const getDollarsFromDai = (dai: number) => dai / 100;

export function formattedCurrencyToAbsNum(
  value?: string,
  noDecimal?: boolean
): number {
  if (!value) {
    return 0;
  }

  const result = Math.abs(convertStringToNumber(value));

  if (isNaN(result)) {
    return 0;
  }

  if (noDecimal) {
    return Math.floor(result);
  }

  return result;
}

// format amount string value to formatted currency value
export function formatNative(
  value: string | undefined,
  currency = CURRENT_CURRENCY
): string {
  if (!value) {
    return '';
  }

  return formatCurrencyAmount(
    formattedCurrencyToAbsNum(value),
    currencies[currency as Currency]?.decimals
  );
}

export const nativeCurrencyToAmountInSpend = (
  amount: string | undefined,
  nativeCurrencyRate: number
): number => {
  return amount
    ? convertStringToNumber(
        convertAmountFromNativeValue(
          usdToSpend(parseFloat(amount.replace(',', ''))) || 0,
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
