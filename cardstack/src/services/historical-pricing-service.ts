import { cryptoCurrencies, NativeCurrency } from '@cardstack/cardpay-sdk';
import { format } from 'date-fns';

import { getExchangeRatesQuery } from '@cardstack/services/hub/hub-service';
import { removeCPXDTokenSuffix } from '@cardstack/utils';

import logger from 'logger';

export const fetchHistoricalPrice = async (
  symbol: string,
  timestamp: number,
  nativeCurrency: NativeCurrency | string
): Promise<number> => {
  try {
    if (!symbol) {
      return 0;
    }

    // date needs to be formatted as yyyy-MM-dd
    const formattedDate = format(timestamp, 'yyyy-MM-dd');

    // For cpxd tokens we chop off .CPXD in order to get mainnet's historical price
    const tokenSymbol = removeCPXDTokenSuffix(symbol);

    // cryptocompare does not support CARD price history correctly,
    // so uses kucoin exchange to get CARD price in USDT(kucoin supports only USDT) and convert it to native currency
    if (tokenSymbol === cryptoCurrencies.CARD.currency) {
      const { data: kucoinRate } = await getExchangeRatesQuery({
        from: tokenSymbol,
        to: 'USDT',
        date: formattedDate,
        e: 'kucoin',
      });

      const usdtPrice = kucoinRate?.USDT;

      const { data: USDTRate } = await getExchangeRatesQuery({
        from: 'USDT',
        to: tokenSymbol,
        date: formattedDate,
      });

      const nativeCurrencyPriceForUSDT = USDTRate?.[tokenSymbol];

      if (usdtPrice && nativeCurrencyPriceForUSDT) {
        return usdtPrice * nativeCurrencyPriceForUSDT;
      } else {
        return 0;
      }
    }

    const defaultParams = {
      from: tokenSymbol,
      to: nativeCurrency,
      date: formattedDate,
    };

    const { data: rates } = await getExchangeRatesQuery(defaultParams);

    const price = rates?.[nativeCurrency] ?? 0;

    return price;
  } catch (e) {
    logger.sentry(`fetchHistoricalPrice failed ---` + e);

    return 0;
  }
};
