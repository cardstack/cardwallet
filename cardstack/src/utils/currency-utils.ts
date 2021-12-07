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

  const decimalAllowed = currency !== NativeCurrency.SPD;
  const isIncludeOneDot = (value.match(/\./g) || []).length === 1;

  if (decimalAllowed && value.endsWith('.') && isIncludeOneDot) {
    return `${formattedCurrencyToAbsNum(value).toLocaleString('en-US', {
      currency,
      maximumFractionDigits: 20,
      maximumSignificantDigits: 20,
    })}.`;
  }

  if (decimalAllowed && isIncludeOneDot) {
    const decimalStrings = value.split('.');
    return `${formattedCurrencyToAbsNum(decimalStrings[0]).toLocaleString(
      'en-US'
    )}.${decimalStrings[1].replace(/\D/g, '')}`;
  }

  return `${formattedCurrencyToAbsNum(value, !decimalAllowed).toLocaleString(
    'en-US',
    {
      currency,
      maximumFractionDigits: 20,
      maximumSignificantDigits: 20,
    }
  )}`;
}

export const decimalFixingConverter = (value: string) =>
  Number(value).toFixed(2).toString();
