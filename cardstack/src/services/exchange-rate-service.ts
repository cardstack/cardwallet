import { getSDK } from '@cardstack/cardpay-sdk';
import { NativeCurrency } from '@cardstack/cardpay-sdk/sdk/currencies';
import { CurrencyConversionRates } from '@cardstack/types';
import Web3Instance from '@cardstack/models/web3-instance';

export const getNativeBalanceFromOracle = async (props: {
  symbol: string | null | undefined;
  balance: string;
  nativeCurrency: string;
  currencyConversionRates: CurrencyConversionRates;
}): Promise<number> => {
  const { symbol, balance, nativeCurrency, currencyConversionRates } = props;

  if (!symbol) {
    return 0;
  }

  const web3 = await Web3Instance.get();
  const layerTwoOracle = await getSDK('LayerTwoOracle', web3);

  const usdBalance = await layerTwoOracle.getUSDPrice(symbol, balance);

  const nativeBalance =
    nativeCurrency === NativeCurrency.USD
      ? usdBalance
      : currencyConversionRates[nativeCurrency] * usdBalance;

  return nativeBalance;
};

export const getUsdConverter = async (symbol: string) => {
  const web3 = await Web3Instance.get();
  const layerTwoOracle = await getSDK('LayerTwoOracle', web3);
  const converter = await layerTwoOracle.getUSDConverter(symbol);

  return converter;
};
