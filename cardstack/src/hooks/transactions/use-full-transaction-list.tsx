import { NetworkStatus } from '@apollo/client';

import { useGetAccountTransactionHistoryDataQuery } from '@cardstack/graphql';

import { useAccountSettings } from '@rainbow-me/hooks';
import logger from 'logger';

import { TRANSACTION_PAGE_SIZE } from '../../constants';

import { useTransactionSections } from './use-transaction-sections';

export const useCardPayCompatible = () => {
  const { accountAddress, network, noCardPayAccount } = useAccountSettings();

  const {
    data,
    networkStatus,
    fetchMore,
    refetch,
    error,
  } = useGetAccountTransactionHistoryDataQuery({
    notifyOnNetworkStatusChange: true,
    skip: noCardPayAccount,
    variables: {
      address: accountAddress,
      pageSize: TRANSACTION_PAGE_SIZE,
    },
    context: { network },
    fetchPolicy: 'network-only',
  });

  const account = data?.account;
  const transactions = account?.transactions;

  if (error) {
    logger.log('Error getting full transactions', error, accountAddress);
  }

  const {
    sections,
    loading,
    isFetchingMore,
    onEndReached,
  } = useTransactionSections({
    transactions,
    isEmpty: Boolean(!account),
    transactionsCount: transactions?.length || 0,
    networkStatus,
    fetchMore,
  });

  return {
    isLoadingTransactions: loading,
    isFetchingMore,
    onEndReached,
    refetch,
    refetchLoading: networkStatus === NetworkStatus.refetch,
    sections: sections,
  };
};
