import { useGetPrepaidCardHistoryDataQuery } from '@cardstack/graphql';
import { PrepaidCardCreationStrategy } from '@cardstack/transaction-mapping-strategies/transaction-mapping-strategy-types/prepaid-card-creation-strategy';
import { PrepaidCardPaymentStrategy } from '@cardstack/transaction-mapping-strategies/transaction-mapping-strategy-types/prepaid-card-payment-strategy';
import { PrepaidCardTransferStrategy } from '@cardstack/transaction-mapping-strategies/transaction-mapping-strategy-types/prepaid-card-transfer-strategy';

import logger from 'logger';

import { useRainbowSelector } from '../../../../src/redux/hooks';

import { useTransactionSections } from './use-transaction-sections';

export const usePrepaidCardTransactions = (prepaidCardAddress: string) => {
  const [network] = useRainbowSelector(state => [state.settings.network]);

  const {
    data,
    error,
    networkStatus,
    fetchMore,
  } = useGetPrepaidCardHistoryDataQuery({
    variables: {
      address: prepaidCardAddress,
    },
    context: { network },
  });

  let transactions: ({ transaction: any } | null | undefined)[] | undefined;

  const prepaidCard = data?.safe?.prepaidCard;

  if (prepaidCard) {
    const { transfers, payments, creation } = prepaidCard;

    transactions = [...transfers, ...payments, creation];
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
    transactionStrategies: [
      PrepaidCardCreationStrategy,
      PrepaidCardPaymentStrategy,
      PrepaidCardTransferStrategy,
    ],
  });

  return {
    loading,
    sections,
  };
};
