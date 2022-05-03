import { cryptoCurrencies } from '@cardstack/cardpay-sdk';
import { CRYPTOCOMPARE_API_KEY } from 'react-native-dotenv';

import { removeCPXDTokenSuffix } from '@cardstack/utils';

import logger from 'logger';

const CryptoCompareAPIBaseURL = `https://min-api.cryptocompare.com/data/pricehistorical?&api_key=${CRYPTOCOMPARE_API_KEY}`;

export const fetchHistoricalPrice = async (
  symbol: string,
  timestamp: string | number,
  nativeCurrency: string
): Promise<number> => {
  try {
    if (!symbol) {
      return 0;
    }

    // For cpxd tokens we chop off .CPXD in order to get mainnet's historical price
    const tokenSymbol = removeCPXDTokenSuffix(symbol);

    // cryptocompare does not support CARD price history correctly,
    // so uses kucoin exchange to get CARD price in USDT(kucoin supports only USDT) and convert it to native currency
    if (tokenSymbol === cryptoCurrencies.CARD.currency) {
      const usdtPriceData = await (
        await fetch(
          `${CryptoCompareAPIBaseURL}&fsym=${tokenSymbol}&tsyms=USDT&ts=${timestamp}&e=kucoin`
        )
      ).json();

      const usdtPrice = usdtPriceData.CARD.USDT;

      const nativeCurrencyPriceForUSDT = await fetchHistoricalPrice(
        'USDT',
        timestamp,
        nativeCurrency
      );

      return usdtPrice * nativeCurrencyPriceForUSDT;
    }

    const response = await fetch(
      `${CryptoCompareAPIBaseURL}&fsym=${tokenSymbol}&tsyms=${nativeCurrency}&ts=${timestamp}`
    );

    const data = await response.json();
    const price = data[tokenSymbol][nativeCurrency];

    return price;
  } catch (e) {
    logger.sentry(`fetchHistoricalPrice failed ---` + e);

    return 0;
  }
};
