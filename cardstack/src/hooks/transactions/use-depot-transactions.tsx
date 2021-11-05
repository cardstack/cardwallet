import { NetworkStatus } from '@apollo/client';

import { useRainbowSelector } from '../../../../src/redux/hooks';
import { TRANSACTION_PAGE_SIZE } from '../../constants';
import { useTransactionSections } from './use-transaction-sections';
import logger from 'logger';
import { useGetDepotTransactionHistoryDataQuery } from '@cardstack/graphql';

export const useDepotTransactions = (safeAddress: string) => {
  const [network] = useRainbowSelector(state => [state.settings.network]);

  const {
    data,
    networkStatus,
    fetchMore,
    refetch,
    error,
  } = useGetDepotTransactionHistoryDataQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      address: safeAddress,
      pageSize: TRANSACTION_PAGE_SIZE,
    },
    context: { network },
    fetchPolicy: 'network-only',
  });

  const transactions = data?.eoatransactions;

  if (error) {
    logger.log('Error getting Sokol transactions', error);
  }

  const {
    sections,
    loading,
    isFetchingMore,
    onEndReached,
  } = useTransactionSections({
    transactions,
    isEmpty: data === null,
    transactionsCount: transactions?.length || 0,
    networkStatus,
    fetchMore,
    isDepotTransaction: true,
  });

  return {
    isLoadingTransactions: loading,
    isFetchingMore,
    onEndReached,
    refetch,
    refetchLoading: networkStatus === NetworkStatus.refetch,
    sections,
  };
};
