import { isEmpty } from 'lodash';
import { useEffect, useMemo, useState } from 'react';

import { daysFromTheFirstTx } from '../../utils/ethereumUtils';

const formatChartData = chart => {
  if (!chart || isEmpty(chart)) return null;
  return chart.map(([x, y]) => ({ x, y }));
};

export default function useChartData(asset) {
  const [daysFromFirstTx, setDaysFromFirstTx] = useState(1000);

  const { value: price } = {};

  const chart = formatChartData(asset.chartPrices);
  const chartType = 'd';
  const fetchingCharts = false;

  useEffect(() => {
    async function fetchDays() {
      const days = await daysFromTheFirstTx(asset.address);
      setDaysFromFirstTx(days);
    }
    if (asset.address) {
      fetchDays();
    }
  }, [asset]);

  // add current price at the very end
  const filteredData = useMemo(() => {
    const now = Date.now();
    return chart
      ?.filter(({ x }) => x <= now)
      .slice(0, chart.length - 1)
      .concat({ x: now, y: price });
  }, [chart, price]);

  return {
    chart: filteredData,
    chartType,
    fetchingCharts,
    showMonth: daysFromFirstTx > 7,
    showYear: daysFromFirstTx > 30,
  };
}
