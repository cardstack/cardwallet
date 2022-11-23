import { NetworkStatus } from '@apollo/client';

import { useGetAccountTransactionHistoryDataQuery } from '@cardstack/graphql';
import { NetworkType } from '@cardstack/types';
import { isLayer1, isCardPayCompatible } from '@cardstack/utils';

import { useAccountTransactions } from '@rainbow-me/hooks';
import logger from 'logger';

import { useRainbowSelector } from '../../../../src/redux/hooks';
import { TRANSACTION_PAGE_SIZE } from '../../constants';

import { useTransactionSections } from './use-transaction-sections';

const useCardPayCompatible = () => {
  const [accountAddress, network] = useRainbowSelector(state => [
    state.settings.accountAddress,
    state.settings.network,
  ]);

  const isNotLayer2 = !isCardPayCompatible(network as NetworkType);

  const {
    data,
    networkStatus,
    fetchMore,
    refetch,
    error,
  } = useGetAccountTransactionHistoryDataQuery({
    notifyOnNetworkStatusChange: true,
    skip: isNotLayer2,
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
    logger.log(
      'Error getting full transactions',
      error,
      isNotLayer2,
      accountAddress
    );
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

export const useFullTransactionList = () => {
  const network = useRainbowSelector(
    state => state.settings.network
  ) as NetworkType;

  const layer1Data = useAccountTransactions();
  const cardPayCompatibledata = useCardPayCompatible();

  if (isCardPayCompatible(network)) {
    return cardPayCompatibledata;
  }

  if (isLayer1(network)) {
    return {
      ...layer1Data,
      refetch: () => ({}),
      refetchLoading: false,
    };
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
