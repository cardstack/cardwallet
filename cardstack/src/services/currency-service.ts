
export const getCurrencyConversionRate = async (
  USDAmount: number,
  nativeCurrency: string
) => {
  try {
    const response = await fetch(
      `${FIXER_BASE_URL}/latest?access_key=${FIXER_API_KEY}&base=USD&symbols=${nativeCurrency}`
    );

    const data = await response.json();

    return data.rates[nativeCurrency];
  } catch (error) {
    console.log('Error converting currency with fixer', error);
  }

  return 0;
};
