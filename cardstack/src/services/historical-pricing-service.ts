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

    const defaultParams = {
      from: tokenSymbol,
      to: nativeCurrency,
      date: formattedDate,
    };

    // cryptocompare does not support CARD price history correctly,
    // so uses kucoin exchange to get CARD price in USDT(kucoin supports only USDT) and convert it to native currency
    if (tokenSymbol === cryptoCurrencies.CARD.currency) {
      const { data: kucoinRate } = await getExchangeRatesQuery({
        ...defaultParams,
        to: 'USDT',
        e: 'kucoin',
      });

      const usdtPrice = kucoinRate?.USDT || 0;

      const { data: USDTRate } = await getExchangeRatesQuery({
        ...defaultParams,
        from: 'USDT',
        to: tokenSymbol,
      });

      const nativeCurrencyPriceForUSDT = USDTRate?.[tokenSymbol] || 0;

      return usdtPrice * nativeCurrencyPriceForUSDT;
    }

    const { data: rates } = await getExchangeRatesQuery(defaultParams);

    const price = rates?.[nativeCurrency] ?? 0;

    return price;
  } catch (e) {
    logger.sentry(`fetchHistoricalPrice failed ---` + e);

    return 0;
  }
};
