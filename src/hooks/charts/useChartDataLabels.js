import { toFixedDecimals } from '@cardstack/cardpay-sdk';
import { useCallback, useMemo } from 'react';
import { useValue } from 'react-native-redash/lib/module/v1';
import ChartTypes from '@rainbow-me/helpers/chartTypes';

const formatPercentChange = (change = 0) => toFixedDecimals(change, 2);

export default function useChartDataLabels({ asset, chartType, points }) {
  const changeDirection = useValue(1);

  const latestPrice = asset?.native?.price?.amount;

  const getPercentChangeForPrice = useCallback(
    startPrice => {
      const endPrice = points?.[points.length - 1].y || latestPrice;
      const percent = ((endPrice - startPrice) / startPrice) * 100;
      return formatPercentChange(percent);
    },
    [latestPrice, points]
  );

  const latestChange = useMemo(
    () =>
      !points || chartType === ChartTypes.day
        ? formatPercentChange(asset?.price?.relative_change_24h)
        : getPercentChangeForPrice(points[0].y),
    [asset, chartType, getPercentChangeForPrice, points]
  );

  return {
    changeDirection,
    latestChange,
    latestPrice,
  };
}
