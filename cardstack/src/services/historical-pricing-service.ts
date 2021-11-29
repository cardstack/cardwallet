import { CRYPTOCOMPARE_API_KEY } from 'react-native-dotenv';
import logger from 'logger';
import { removeCPXDTokenSuffix } from '@cardstack/utils';

export const fetchHistoricalPrice = async (
  symbol: string,
  timestamp: string | number,
  nativeCurrency: string
) => {
  try {
    // For cpxd tokens we chop off .CPXD in order to get mainnet's historical price
    const tokenSymbol = removeCPXDTokenSuffix(symbol);

    // cryptocompare does not support CARD price history correctly,
    // so uses kucoin exchange to get CARD price in USDT(kucoin supports only USDT) and convert it to native currency
    if (tokenSymbol === 'CARD') {
      const usdtPriceData = await (
        await fetch(
          `https://min-api.cryptocompare.com/data/pricehistorical?fsym=${tokenSymbol}&tsyms=USDT&ts=${timestamp}&e=kucoin&api_key=${CRYPTOCOMPARE_API_KEY}`
        )
      ).json();

      const usdtPrice = usdtPriceData.CARD.USDT;

      const nativeCurrencyDataForUSDT = await (
        await fetch(
          `https://min-api.cryptocompare.com/data/pricehistorical?fsym=USDT&tsyms=${nativeCurrency}&ts=${timestamp}&api_key=${CRYPTOCOMPARE_API_KEY}`
        )
      ).json();

      const nativeCurrencyPriceForUSDT =
        nativeCurrencyDataForUSDT.USDT[nativeCurrency];

      return usdtPrice * nativeCurrencyPriceForUSDT;
    }

    const response = await fetch(
      `https://min-api.cryptocompare.com/data/pricehistorical?fsym=${tokenSymbol}&tsyms=${nativeCurrency}&ts=${timestamp}&api_key=${CRYPTOCOMPARE_API_KEY}`
    );

    const data = await response.json();
    const price = data[tokenSymbol][nativeCurrency];

    return price;
  } catch (e) {
    logger.sentry(`fetchHistoricalPrice failed ---`, e);

    return 0;
  }
};
