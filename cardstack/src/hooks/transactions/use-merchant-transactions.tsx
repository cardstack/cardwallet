import { NetworkStatus } from '@apollo/client';

import { useRainbowSelector } from '../../../../src/redux/hooks';
import { TRANSACTION_PAGE_SIZE } from '../../constants';
import { getApolloClient } from '../../graphql/apollo-client';
import { useTransactionSections } from './use-transaction-sections';
import logger from 'logger';
import { useGetMerchantTransactionHistoryDataQuery } from '@cardstack/graphql';

export const useMerchantTransactions = (safeAddress: string) => {
  const [network] = useRainbowSelector(state => [state.settings.network]);

  const client = getApolloClient(network);

  const {
    data,
    networkStatus,
    fetchMore,
    refetch,
    error,
  } = useGetMerchantTransactionHistoryDataQuery({
    client,
    notifyOnNetworkStatusChange: true,
    variables: {
      address: safeAddress,
      pageSize: TRANSACTION_PAGE_SIZE,
    },
    fetchPolicy: 'network-only', // not cache transaction list result
  });

  const revenueEvents = data?.merchantSafe?.merchantRevenue?.[0]?.revenueEvents;

  if (error) {
    logger.log('Error getting Merchant transactions', error);
  }

  const {
    sections,
    loading,
    isFetchingMore,
    onEndReached,
  } = useTransactionSections({
    transactions: revenueEvents as any,
    isEmpty: !revenueEvents || revenueEvents?.length === 0,
    transactionsCount: revenueEvents?.length || 0,
    networkStatus,
    fetchMore,
    isMerchantTransactions: true,
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
