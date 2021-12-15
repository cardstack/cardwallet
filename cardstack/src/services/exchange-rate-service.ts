import {
  getSDK,
  nativeCurrencies,
  NativeCurrency,
} from '@cardstack/cardpay-sdk';

import { FIXER_API_KEY } from 'react-native-dotenv';
import { CurrencyConversionRates } from '@cardstack/types';
import Web3Instance from '@cardstack/models/web3-instance';
import { logger } from '@rainbow-me/utils';

// Currency conversions
const CurrencyConsts = {
  fixerApi: 'https://data.fixer.io/api',
  usdToSpendRate: 100,
  currencySymbols: Object.keys(nativeCurrencies),
};

let cachedCurrencyConversionRates: CurrencyConversionRates | null = null;

export const getCurrencyConversionsRates = async () => {
  const defaults = CurrencyConsts.currencySymbols.reduce(
    (accum, symbol) => ({
      ...accum,
      [symbol]: 0,
    }),
    {}
  );

  try {
    const request = await fetch(
      `${CurrencyConsts.fixerApi}/latest?access_key=${FIXER_API_KEY}&base=USD&symbols=${CurrencyConsts.currencySymbols}`
    );

    const data = await request.json();

    cachedCurrencyConversionRates = {
      ...data.rates,
      SPD: CurrencyConsts.usdToSpendRate,
    };
  } catch (e) {
    cachedCurrencyConversionRates = defaults;
    logger.log('Error on getCurrencyConversionsRates');
  }

  return cachedCurrencyConversionRates;
};

// Token price to native currency
export const getNativeBalanceFromOracle = async (props: {
  symbol?: string;
  balance: string;
  nativeCurrency: string;
}): Promise<number> => {
  const { symbol, balance, nativeCurrency } = props;

  const isNativeCurrencyUSD = nativeCurrency === NativeCurrency.USD;

  if (!symbol) {
    return 0;
  }

  const web3 = await Web3Instance.get();
  const layerTwoOracle = await getSDK('LayerTwoOracle', web3);

  const usdBalance = await layerTwoOracle.getUSDPrice(symbol, balance);

  if (isNativeCurrencyUSD) {
    return usdBalance;
  } else {
    while (cachedCurrencyConversionRates === null) {
      await getCurrencyConversionsRates();
    }

    return cachedCurrencyConversionRates[nativeCurrency] * usdBalance;
  }
};

export const getUsdConverter = async (symbol: string) => {
  const web3 = await Web3Instance.get();
  const layerTwoOracle = await getSDK('LayerTwoOracle', web3);
  const converter = await layerTwoOracle.getUSDConverter(symbol);

  return converter;
};
