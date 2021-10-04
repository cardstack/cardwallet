import supportedNativeCurrencies from '@cardstack/cardpay-sdk/sdk/native-currencies';
import { useCallback } from 'react';
import { FIXER_API_KEY } from 'react-native-dotenv';
import { useDispatch } from 'react-redux';
import { setCurrencyConversionRates } from '@rainbow-me/redux/currencyConversion';

const FIXER_BASE_URL = 'https://data.fixer.io/api';
const currencySymbols = Object.keys(supportedNativeCurrencies);
const USD_TO_SPD_RATE = 100;

export default function useLoadCurrencyConversionRates() {
  const dispatch = useDispatch();

  const loadCurrencyConversionRates = useCallback(async () => {
    try {
      const request = await fetch(
        `${FIXER_BASE_URL}/latest?access_key=${FIXER_API_KEY}&base=USD&symbols=${currencySymbols}`
      );
      const data = await request.json();
      dispatch(
        setCurrencyConversionRates({ ...data.rates, SPD: USD_TO_SPD_RATE })
      );
    } catch (error) {
      const defaults = currencySymbols.reduce(
        (accum, symbol) => ({
          ...accum,
          [symbol]: 0,
        }),
        {}
      );

      dispatch(setCurrencyConversionRates(defaults));
    }
  }, [dispatch]);

  return loadCurrencyConversionRates;
}
