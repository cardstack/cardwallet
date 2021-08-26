export const getDollarsFromDai = (dai: number) => dai / 100;

export function localCurrencyToAbsNum(value: string): number {
  const result = Math.abs(parseFloat(value.replace(/,/g, '')));

  if (isNaN(result)) {
    return 0;
  }

  return result;
}

export function formatNative(
  value: string | undefined,
  priceSharedValue?: string
) {
  if (!value) {
    return priceSharedValue || '';
  }

  if (value.endsWith('.') && (value.match(/\./g) || []).length === 1) {
    return `${localCurrencyToAbsNum(value).toLocaleString('en-US', {
      maximumFractionDigits: 20,
      maximumSignificantDigits: 20,
    })}.`;
  }

  if ((value.match(/\./g) || []).length === 1) {
    const decimalStrings = value.split('.');
    return `${localCurrencyToAbsNum(decimalStrings[0]).toLocaleString(
      'en-US'
    )}.${decimalStrings[1].replace(/\D/g, '')}`;
  }

  return `${localCurrencyToAbsNum(value).toLocaleString('en-US', {
    maximumFractionDigits: 20,
    maximumSignificantDigits: 20,
  })}`;
}
