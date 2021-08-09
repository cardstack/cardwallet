import { NetworkStatus } from '@apollo/client';
import { useRainbowSelector } from '../../../../src/redux/hooks';
import { TRANSACTION_PAGE_SIZE } from '../../constants';
import { getApolloClient } from '../../graphql/apollo-client';
import { useTransactionSections } from './use-transaction-sections';
import { useGetAccountTransactionHistoryDataQuery } from '@cardstack/graphql';
import { isLayer1 } from '@cardstack/utils';
import { useAccountTransactions } from '@rainbow-me/hooks';
import { networkTypes } from '@rainbow-me/networkTypes';
import logger from 'logger';

const useSokolTransactions = () => {
  const [accountAddress, network] = useRainbowSelector(state => [
    state.settings.accountAddress,
    state.settings.network,
  ]);

  const isNotSokol = network !== networkTypes.sokol;

  const client = getApolloClient(network);

  const {
    data,
    networkStatus,
    fetchMore,
    refetch,
    error,
  } = useGetAccountTransactionHistoryDataQuery({
    client,
    notifyOnNetworkStatusChange: true,
    skip: isNotSokol,
    variables: {
      address: accountAddress,
      pageSize: TRANSACTION_PAGE_SIZE,
    },
  });

  const account = data?.account;
  const transactions = account?.transactions;

  if (error) {
    logger.log('Error getting Sokol transactions', error);
  }

  const isEmpty = account === null;
  const { sections, loading } = useTransactionSections(transactions, isEmpty);

  const transactionsCount = transactions?.length || 0;
  const isLoading = networkStatus === NetworkStatus.loading || loading;
  const isFetchingMore = sections.length && isLoading;

  return {
    isLoadingTransactions: isLoading && !isFetchingMore,
    isFetchingMore,
    onEndReached: () => {
      if (!isFetchingMore && fetchMore) {
        fetchMore({
          variables: {
            skip: transactionsCount,
          },
        });
      }
    },
    refetch,
    refetchLoading: networkStatus === NetworkStatus.refetch,
    sections: sections,
  };
};

export const useFullTransactionList = () => {
  const network = useRainbowSelector(state => state.settings.network);
  const layer1Data = useAccountTransactions();
  const layer2Data = useSokolTransactions();

  if (isLayer1(network)) {
    return {
      ...layer1Data,
      refetch: () => ({}),
      refetchLoading: false,
    };
  } else if (network === networkTypes.sokol) {
    return layer2Data;
  }

  return {
    onEndReached: () => ({}),
    isLoadingTransactions: false,
    isFetchingMore: false,
    sections: [],
    refetch: () => ({}),
    refetchLoading: false,
  };
};
