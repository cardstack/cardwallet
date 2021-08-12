import { groupBy } from 'lodash';
import { groupAccumulationsByDay } from './../utils/date-utils';
import { getApolloClient } from './../graphql/apollo-client';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import { useGetLifetimeEarningsAccumulationsQuery } from '@cardstack/graphql';

export const useLifetimeEarningsData = (merchantSafeAddress: string) => {
  const network = useRainbowSelector(state => state.settings.network);
  const client = getApolloClient(network);

  const { data, loading } = useGetLifetimeEarningsAccumulationsQuery({
    client,
    variables: {
      address: merchantSafeAddress,
    },
  });

  if (!data?.merchantSafe) {
    return {
      data: null,
      loading,
    };
  }

  const groupedAccumulations = groupBy(
    data.merchantSafe?.spendAccumulations,
    groupAccumulationsByDay
  );

  const mappedAccumulations = Object.entries(groupedAccumulations).map(
    ([ts, values]) => {
      console.log('ts, values', ts, values);

      const sum = values.reduce((total: number, item) => {
        const amount =
          item && typeof item === 'object' ? Number(item.amount) : 0;

        return total + amount;
      }, 0);

      return [ts, sum];
    }
  );

  console.log({
    mappedAccumulations: JSON.stringify(mappedAccumulations, null, 2),
  });

  return {
    data: groupedAccumulations,
    loading,
  };
};
