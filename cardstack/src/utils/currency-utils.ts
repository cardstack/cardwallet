import { NativeCurrency } from '@cardstack/cardpay-sdk/sdk/currencies';
import {
  getNumberFormatSettings,
  getCurrencies,
  getLocales,
} from 'react-native-localize';
import numbro from 'numbro';
export const getDollarsFromDai = (dai: number) => dai / 100;
export const {
  decimalSeparator,
  groupingSeparator,
} = getNumberFormatSettings();
export const currentLocale = getLocales()[0].languageTag;
export const CURRENT_CURRENCY = getCurrencies()[0];

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
) {
  if (!value) {
    return '';
  }

  const decimalAllowed = currency !== NativeCurrency.SPD;

  const isIncludeOneDecimalSeparator =
    (value.match(new RegExp(decimalSeparator, 'g')) || []).length === 1;

  if (value.endsWith(decimalSeparator) && isIncludeOneDecimalSeparator) {
    return `${convertToReadableCurrency(
      value,
      !decimalAllowed
    )}${decimalSeparator}`;
  }

  if (value.endsWith(decimalSeparator)) {
    return convertToReadableCurrency(value.slice(0, -1), !decimalAllowed);
  }

  return `${convertToReadableCurrency(value, !decimalAllowed)}`;
}

export const decimalFixingConverter = (value: string) =>
  Number(value).toFixed(2).toString();
