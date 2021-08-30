import Web3 from 'web3';
import { getSDK } from '@cardstack/cardpay-sdk';
import { CurrencyConversionRates } from '@cardstack/types';
import { getWeb3ProviderSdk } from '@rainbow-me/handlers/web3';
import logger from 'logger';

export const getNativeBalance = async (props: {
  symbol: string | null | undefined;
  balance: string;
  nativeCurrency: string;
  currencyConversionRates: CurrencyConversionRates;
}): Promise<number> => {
  const { symbol, balance, nativeCurrency, currencyConversionRates } = props;

  if (!symbol) {
    return 0;
  }

  const web3 = new Web3(await getWeb3ProviderSdk());
  const layerTwoOracle = await getSDK('LayerTwoOracle', web3);

  const usdBalance = await layerTwoOracle.getUSDPrice(symbol, balance);

  const nativeBalance =
    nativeCurrency === 'USD'
      ? usdBalance
      : currencyConversionRates[nativeCurrency] * usdBalance;

  return nativeBalance;
};

export const getUsdConverter = async (symbol: string) => {
  try {
    const web3 = new Web3(await getWeb3ProviderSdk());
    const layerTwoOracle = await getSDK('LayerTwoOracle', web3);
    const converter = await layerTwoOracle.getUSDConverter(symbol);

    return converter;
  } catch (e) {
    logger.error('Error on getUsdConverter', e);
  }
};
