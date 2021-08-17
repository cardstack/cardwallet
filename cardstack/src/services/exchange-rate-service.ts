import Web3 from 'web3';
import { getSDK } from '@cardstack/cardpay-sdk';
import { CurrencyConversionRates } from '@cardstack/types';
import { web3ProviderSdk } from '@rainbow-me/handlers/web3';

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

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const web3 = new Web3(web3ProviderSdk);
  const layerTwoOracle = await getSDK('LayerTwoOracle', web3);

  const usdBalance = await layerTwoOracle.getUSDPrice(symbol, balance);

  const nativeBalance =
    nativeCurrency === 'USD'
      ? usdBalance
      : currencyConversionRates[nativeCurrency] * usdBalance;

  return nativeBalance;
};
