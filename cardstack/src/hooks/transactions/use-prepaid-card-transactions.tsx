import { useRainbowSelector } from '../../../../src/redux/hooks';
import { getApolloClient } from '../../graphql/apollo-client';
import { useTransactionSections } from './use-transaction-sections';
import logger from 'logger';
import { useGetPrepaidCardHistoryDataQuery } from '@cardstack/graphql';

export const usePrepaidCardTransactions = (prepaidCardAddress: string) => {
  const [network] = useRainbowSelector(state => [state.settings.network]);

  const client = getApolloClient(network);

  const {
    data,
    error,
    networkStatus,
    fetchMore,
  } = useGetPrepaidCardHistoryDataQuery({
    client,
    variables: {
      address: prepaidCardAddress,
    },
  });

  let transactions: ({ transaction: any } | null | undefined)[] | undefined;

  const prepaidCard = data?.safe?.prepaidCard;

  if (prepaidCard) {
    const { splits, transfers, payments, creation } = prepaidCard;

    transactions = [...splits, ...transfers, ...payments, creation];
  }

  if (error) {
    logger.log('Error getting prepaid card transactions', error);
  }

  const { sections, loading } = useTransactionSections({
    transactions,
    isEmpty: prepaidCard === null,
    transactionsCount: transactions?.length || 0,
    networkStatus,
    fetchMore,
  });

  return {
    loading,
    sections,
  };
};
