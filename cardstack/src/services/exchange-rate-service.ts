import { getSDK, NativeCurrency, spendToUsd } from '@cardstack/cardpay-sdk';

import Web3Instance from '@cardstack/models/web3-instance';

import { getExchangeRatesQuery } from './hub/hub-service';

const getLayerTwoOracleInstance = async () => {
  const web3 = await Web3Instance.get();
  const layerTwoOracle = await getSDK('LayerTwoOracle', web3);

  return layerTwoOracle;
};

export const getValueInNativeCurrency = async (
  value: number,
  nativeCurrency: NativeCurrency,
  truncate = true
) => {
  const isNativeCurrencyUSD = nativeCurrency === NativeCurrency.USD;

  if (isNativeCurrencyUSD) {
    return value;
  }

  const { data: rates } = await getExchangeRatesQuery();

  const convertedAmount = (rates?.[nativeCurrency] ?? 0) * value;

  return truncate ? parseFloat(convertedAmount.toFixed(2)) : convertedAmount;
};

export const getSpendValueInNativeCurrency = async (
  spendAmount: number,
  nativeCurrency: NativeCurrency
) => {
  const usdBalance = spendToUsd(spendAmount) || 0;

  return await getValueInNativeCurrency(usdBalance, nativeCurrency);
};

// Token price to native currency
export const getNativeBalanceFromOracle = async (props: {
  symbol?: string;
  balance: string;
  nativeCurrency: NativeCurrency;
}): Promise<number> => {
  const { symbol, balance, nativeCurrency } = props;

  if (!symbol) {
    return 0;
  }

  const layerTwoOracle = await getLayerTwoOracleInstance();

  const usdBalance = await layerTwoOracle.getUSDPrice(symbol, balance);

  const currencyBalance = await getValueInNativeCurrency(
    usdBalance,
    nativeCurrency
  );

  return currencyBalance || 0;
};

export const getUsdConverter = async (symbol: string) => {
  const layerTwoOracle = await getLayerTwoOracleInstance();

  const converter = await layerTwoOracle.getUSDConverter(symbol);

  return converter;
};

export const convertTokenToSpend = async (token: string, amount: string) => {
  const layerTwoOracle = await getLayerTwoOracleInstance();

  const result = await layerTwoOracle.convertToSpend(token, amount);

  return result;
};
