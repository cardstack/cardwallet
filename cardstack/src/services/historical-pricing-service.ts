import { CRYPTOCOMPARE_API_KEY } from 'react-native-dotenv';
import logger from 'logger';
import { removeCPXDTokenSuffix } from '@cardstack/utils';

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
    // For cpxd tokens we chop off .CPXD in order to get mainnet's historical price
    const tokenSymbol = removeCPXDTokenSuffix(symbol);

    const roundedTimestamp = getRoundedTimestamp(timestamp);

    const response = await fetch(
      `https://min-api.cryptocompare.com/data/pricehistorical?fsym=${tokenSymbol}&tsyms=${nativeCurrency}&ts=${roundedTimestamp}&api_key=${CRYPTOCOMPARE_API_KEY}`
    );

    const data = await response.json();
    const price = data[tokenSymbol][nativeCurrency];

    return price;
  } catch (e) {
    logger.sentry(`fetchHistoricalPrice failed ---`, e);

    return 0;
  }
};
