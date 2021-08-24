export const getDollarsFromDai = (dai: number) => dai / 100;

export function formatNative(value: string | undefined, priceSharedValue?: string) {
  if (!value) {
    return priceSharedValue || '';
  }

  if (value.endsWith('.') && (value.match(/\./g)||[]).length === 1) {
    return `${localCurrencyToNum(value).toLocaleString('en-US', { maximumFractionDigits: 11 })}.`;
  }
  return `${localCurrencyToNum(value).toLocaleString('en-US', { maximumFractionDigits: 11 })}`;
}

export function localCurrencyToNum(value: string) {
  return parseFloat(value.replace(/,/g,''));
}
