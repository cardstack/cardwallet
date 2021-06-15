import { groupBy } from 'lodash';
import { groupTransactionsByDate, isLayer1 } from '@cardstack/utils';
import { useAccountTransactions } from '@rainbow-me/hooks';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';

const useSokolTransactions = () => {
  // const [accountAddress, network] = useRainbowSelector(state => [
  //   state.settings.accountAddress,
  //   state.settings.network,
  // ]);

  const transactions = useRainbowSelector(state => state.data.transactions);

  // const { data, loading, error } = useQuery(getTransactionHistoryData, {
  //   client: sokolClient,
  //   skip: !accountAddress || isLayer1(network),
  //   variables: {
  //     address: accountAddress,
  //   },
  // });

  // if (error) {
  //   logger.log('Error getting Sokol transactions', error);
  // }

  const data = groupBy(transactions, groupTransactionsByDate);

  const sections = Object.keys(data).map(title => ({
    data: data[title],
    title,
  }));

  return {
    isLoadingTransactions: false,
    sections: sections,
  };
};

export const useTransactions = () => {
  const network = useRainbowSelector(state => state.settings.network);
  const layer1Data = useAccountTransactions();
  const layer2Data = useSokolTransactions();

  if (isLayer1(network)) {
    return layer1Data;
  }

  return layer2Data;
};
