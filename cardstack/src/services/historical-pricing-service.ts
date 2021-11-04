import { CRYPTOCOMPARE_API_KEY } from 'react-native-dotenv';
import { getNativeBalanceFromOracle } from './exchange-rate-service';
import logger from 'logger';
import { toWei } from '@rainbow-me/handlers/web3';
import { isCPXDToken } from '@cardstack/utils';

const getRoundedTimestamp = (timestamp: string | number) => {
  const date = new Date(Number(timestamp) * 1000);

  date.setHours(0, 0, 0, 0);

  return date.getTime();
};

export const fetchHistoricalPrice = async (
  symbol: string,
  timestamp: string | number,
  nativeCurrency: string
) => {
  try {
    if (isCPXDToken(symbol)) {
      const priceFromOracle = await getNativeBalanceFromOracle({
        symbol,
        nativeCurrency,
        balance: toWei('1'),
      });

      return priceFromOracle;
    }

    const roundedTimestamp = getRoundedTimestamp(timestamp);

    const response = await fetch(
      `https://min-api.cryptocompare.com/data/pricehistorical?fsym=${symbol}&tsyms=${nativeCurrency}&ts=${roundedTimestamp}&api_key=${CRYPTOCOMPARE_API_KEY}`
    );

    const data = await response.json();
    const price = data[symbol][nativeCurrency];

    return price;
  } catch (e) {
    logger.sentry(`fetchHistoricalPrice failed ---`, e);

    return 0;
  }
};
