import { NativeCurrency } from '@cardstack/cardpay-sdk/sdk/currencies';
import { getNumberFormatSettings, getCurrencies } from 'react-native-localize';
import numbro from 'numbro';

export const {
  decimalSeparator,
  groupingSeparator,
} = getNumberFormatSettings();
export const CURRENT_CURRENCY = getCurrencies()[0];

export const getDollarsFromDai = (dai: number) => dai / 100;

export function formattedCurrencyToAbsNum(
  value?: string,
  noDecimal?: boolean
): number {
  if (!value) {
    return 0;
  }

  const result = Math.abs(
    numbro.unformat(value, { output: 'number', base: 'decimal' })
  );

  if (isNaN(result)) {
    return 0;
  }

  if (noDecimal) {
    return Math.floor(result);
  }

  return result;
}

const convertToReadableCurrency = (
  value: string | undefined,
  noDecimal?: boolean
) =>
  numbro(formattedCurrencyToAbsNum(value, noDecimal)).format({
    thousandSeparated: true,
  });

// format amount string value based on user's region and number format settings for input amount experience
export function formatNative(
  value: string | undefined,
  currency = CURRENT_CURRENCY
): string {
  if (!value) {
    return '';
  }

  const decimalAllowed = currency !== NativeCurrency.SPD;

  const isIncludeOneDecimalSeparator =
    (value.match(new RegExp(`\\${decimalSeparator}`, 'g')) || []).length === 1;

  if (isIncludeOneDecimalSeparator) {
    const valueSplittedWithDecimal = value.split(decimalSeparator);
    return `${convertToReadableCurrency(valueSplittedWithDecimal[0])}${
      decimalAllowed
        ? `${decimalSeparator}${(valueSplittedWithDecimal[1] || '').replace(
            /\D/g,
            ''
          )}`
        : ''
    }`;
  }

  // check for groupingSeparator as android keyboard has groupingSeparator as well
  if (value.endsWith(decimalSeparator) || value.endsWith(groupingSeparator)) {
    return value.slice(0, -1);
  }

  return `${convertToReadableCurrency(value, !decimalAllowed)}`;
}

export const decimalFixingConverter = (value: string) =>
  Number(value).toFixed(2).toString();
