import BigNumber from 'bignumber.js';

const USD_TO_SPEND_RATE = 100;

export const getDollarsFromDai = (dai: number) => dai / 100;

export function localCurrencyToAbsNum(value: string): number {
  const result = Math.abs(parseFloat(value.replace(/,/g, '')));

  if (isNaN(result)) {
    return 0;
  }

  return result;
}

// format amount for amount TextInput box experience
export function formatNative(value: string | undefined, currency = 'USD') {
  if (!value) {
    return '';
  }

  if (value.endsWith('.') && (value.match(/\./g) || []).length === 1) {
    return `${localCurrencyToAbsNum(value).toLocaleString('en-US', {
      currency,
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
    currency,
    maximumFractionDigits: 20,
    maximumSignificantDigits: 20,
  })}`;
}

export const nativeCurrencyToAmountInSpend = (
  amount: string | undefined,
  nativeCurrencyRate: number
): number => {
  return amount
    ? new BigNumber(localCurrencyToAbsNum(amount))
        .times(USD_TO_SPEND_RATE)
        .div(nativeCurrencyRate)
        .integerValue() // round spend value to integer
        .toNumber()
    : 0;
};

export const nativeCurrencyToSpend = (
  amount: string | undefined,
  nativeCurrencyRate: number,
  includeSuffix?: boolean
) => {
  const spendAmount = nativeCurrencyToAmountInSpend(amount, nativeCurrencyRate);

  return {
    tokenBalanceDisplay: `§${spendAmount.toLocaleString('en-US')}${
      includeSuffix ? ' SPEND' : ''
    }`,
    spendAmount: spendAmount,
  };
};
