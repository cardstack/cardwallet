import { getLocal, saveLocal } from '@rainbow-me/handlers/localstorage/common';
import logger from 'logger';

const VERSION = '0.1.0';

const getCacheKey = (
  symbol: string,
  timestamp: number,
  nativeCurrency: string
) => `${symbol}-${nativeCurrency}-${timestamp}`;

const getCachedPrice = async (
  symbol: string,
  timestamp: number,
  nativeCurrency: string
) => {
  const cacheKey = getCacheKey(symbol, timestamp, nativeCurrency);

  const cachedPrice = (await getLocal(cacheKey, VERSION)) as {
    data?: {
      price?: number;
    };
  };

  if (cachedPrice?.data?.price) {
    logger.log(`Loading ${cacheKey} from local storage`);

    return cachedPrice.data?.price;
  }

  return null;
};

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
  const roundedTimestamp = getRoundedTimestamp(timestamp);

  const cachedPrice = await getCachedPrice(
    symbol,
    roundedTimestamp,
    nativeCurrency
  );

  if (cachedPrice) {
    return cachedPrice;
  }

  const response = await fetch(
    `https://min-api.cryptocompare.com/data/pricehistorical?fsym=${symbol}&tsyms=${nativeCurrency}&ts=${roundedTimestamp}`
  );

  const data = await response.json();
  const price = data[symbol][nativeCurrency];

  const cacheKey = getCacheKey(symbol, roundedTimestamp, nativeCurrency);

  saveLocal(cacheKey, { price }, VERSION);

  return price;
};
