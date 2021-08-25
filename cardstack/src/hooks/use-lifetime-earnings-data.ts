import { groupBy } from 'lodash';
import {
  getTimestamps,
  groupAccumulations,
  Units,
} from './../utils/date-utils';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import { useGetLifetimeEarningsAccumulationsQuery } from '@cardstack/graphql';

export enum ChartFilterOptions {
  DAY = '24H',
  WEEK = '7D',
  MONTH = '1M',
}

const optionToTimeParams: {
  [key in ChartFilterOptions]: {
    amount: number;
    unit: Units;
  };
} = {
  [ChartFilterOptions.DAY]: {
    amount: 24,
    unit: 'hours',
  },
  [ChartFilterOptions.WEEK]: {
    amount: 7,
    unit: 'days',
  },
  [ChartFilterOptions.MONTH]: {
    amount: 30,
    unit: 'days',
  },
};

export const useLifetimeEarningsData = (
  merchantSafeAddress: string,
  option = ChartFilterOptions.MONTH
) => {
  const network = useRainbowSelector(state => state.settings.network);
  const params = optionToTimeParams[option];

  const { data, loading } = useGetLifetimeEarningsAccumulationsQuery({
    variables: {
      address: merchantSafeAddress,
    },
    context: { network },
  });

  if (!data?.merchantSafe) {
    return {
      data: null,
      loading,
    };
  }

  // for grouped accumulations: ey is timestamp, data is array of items that can be put in that timestamp bin
  const groupedAccumulations = groupBy(
    data.merchantSafe?.spendAccumulations,
    groupAccumulations(params.amount, params.unit)
  );

  const timestamps = getTimestamps(params.amount, params.unit).reverse();

  // sum all values within a bin
  // returns array with x as timestamp of bin and y sum of values
  const mappedAccumulations = timestamps.map(ts => {
    const values = groupedAccumulations[ts] || [];

    const sum = values.reduce((total: number, item) => {
      const amount = item && typeof item === 'object' ? Number(item.amount) : 0;

      return total + amount;
    }, 0);

    return {
      x: ts,
      y: sum,
    };
  });

  return {
    data: mappedAccumulations,
    loading,
  };
};
