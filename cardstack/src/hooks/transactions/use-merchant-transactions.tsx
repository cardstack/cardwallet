import { NetworkStatus } from '@apollo/client';
import { useRainbowSelector } from '../../../../src/redux/hooks';
import { TRANSACTION_PAGE_SIZE } from '../../constants';
import { getApolloClient } from '../../graphql/apollo-client';
import { useTransactionSections } from './use-transaction-sections';
import { useGetMerchantTransactionHistoryDataQuery } from '@cardstack/graphql';
import { MerchantClaimStrategy } from '@cardstack/transaction-mapping-strategies/transaction-mapping-strategy-types/merchant-claim-strategy';
import { MerchantEarnedRevenueStrategy } from '@cardstack/transaction-mapping-strategies/transaction-mapping-strategy-types/merchant-earned-revenue-strategy';
import { MerchantEarnedSpendStrategy } from '@cardstack/transaction-mapping-strategies/transaction-mapping-strategy-types/merchant-earned-spend-strategy';
import logger from 'logger';
import { TransactionMappingStrategy } from '@cardstack/transaction-mapping-strategies/context';

type MerchantTransactionTypes = 'lifetimeEarnings' | 'unclaimedRevenue';

const typeToStrategies: {
  [key in MerchantTransactionTypes]: TransactionMappingStrategy[];
} = {
  lifetimeEarnings: [MerchantEarnedSpendStrategy],
  unclaimedRevenue: [MerchantClaimStrategy, MerchantEarnedRevenueStrategy],
};

export const useMerchantTransactions = (
  safeAddress: string,
  type: MerchantTransactionTypes
) => {
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

  const strategies = typeToStrategies[type];

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
    merchantSafeAddress: safeAddress,
    transactionStrategies: strategies,
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
