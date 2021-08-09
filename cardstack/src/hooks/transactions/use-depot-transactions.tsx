import { NetworkStatus } from '@apollo/client';

import { useRainbowSelector } from '../../../../src/redux/hooks';
import { TRANSACTION_PAGE_SIZE } from '../../constants';
import { getApolloClient } from '../../graphql/apollo-client';
import { useTransactionSections } from './use-transaction-sections';
import logger from 'logger';
import { useGetSafeTransactionHistoryDataQuery } from '@cardstack/graphql';

export const useDepotTransactions = (safeAddress: string) => {
  const [network] = useRainbowSelector(state => [state.settings.network]);

  const client = getApolloClient(network);

  const {
    data,
    networkStatus,
    fetchMore,
    refetch,
    error,
  } = useGetSafeTransactionHistoryDataQuery({
    client,
    notifyOnNetworkStatusChange: true,
    variables: {
      address: safeAddress,
      pageSize: TRANSACTION_PAGE_SIZE,
    },
  });

  const safe = data?.safe;
  const transactions = safe?.safeTxns;

  if (error) {
    logger.log('Error getting Sokol transactions', error);
  }

  const isEmpty = safe === null;
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
