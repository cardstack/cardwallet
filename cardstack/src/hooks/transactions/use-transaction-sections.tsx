import { useCallback, useEffect, useMemo, useState } from 'react';
import { groupBy } from 'lodash';
import { NetworkStatus } from '@apollo/client';
import {
  TransactionMappingContext,
  TransactionMappingStrategy,
} from '@cardstack/transaction-mapping-strategies/context';
import {
  useNativeCurrencyAndConversionRates,
  useRainbowSelector,
} from '@rainbow-me/redux/hooks';
import logger from 'logger';
import {
  groupTransactionsByDate,
  merchantRevenueEventsToTransactions,
  sortByTime,
} from '@cardstack/utils';
import usePrevious from '@rainbow-me/hooks/usePrevious';

interface UseTransactionSectionsProps {
  transactions: ({ transaction: any } | null | undefined)[] | undefined;
  isEmpty?: boolean;
  transactionsCount: number;
  networkStatus: NetworkStatus;
  fetchMore?: (props: any) => void;
  merchantSafeAddress?: string;
  transactionStrategies?: TransactionMappingStrategy[];
}

export const useTransactionSections = ({
  transactions,
  isEmpty,
  transactionsCount,
  networkStatus,
  fetchMore,
  merchantSafeAddress,
  transactionStrategies,
}: UseTransactionSectionsProps) => {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [merchantSafes, prepaidCards, depots] = useRainbowSelector(state => [
    state.data.merchantSafes,
    state.data.prepaidCards,
    state.data.depots,
  ]);

  const depot = depots?.[0];

  const [
    nativeCurrency,
    currencyConversionRates,
  ] = useNativeCurrencyAndConversionRates();

  const accountAddress = useRainbowSelector(
    state => state.settings.accountAddress
  );

  const prevLastTransaction = usePrevious(transactions?.[0]?.transaction.id);
  const currentLastTransaction = transactions?.[0]?.transaction.id;

  useEffect(() => {
    const setSectionsData = async () => {
      if (transactions && prevLastTransaction !== currentLastTransaction) {
        setLoading(true);

        try {
          const merchantSafeAddresses = merchantSafes.map(safe => safe.address);
          const prepaidCardAddresses = prepaidCards.map(safe => safe.address);

          const transactionMappingContext = new TransactionMappingContext({
            transactions: merchantSafeAddress
              ? merchantRevenueEventsToTransactions(transactions as any[])
              : transactions.map((t: any) => t?.transaction),
            accountAddress,
            nativeCurrency,
            currencyConversionRates,
            transactionStrategies,
            depotAddress: depot?.address,
            merchantSafeAddresses,
            prepaidCardAddresses,
            merchantSafeAddress,
          });

          const mappedTransactions = await transactionMappingContext.mapTransactions();

          const groupedData = groupBy(
            mappedTransactions,
            groupTransactionsByDate
          );

          const groupedSections = Object.keys(groupedData)
            .map(title => ({
              data: groupedData[title].sort(sortByTime),
              title,
            }))
            .sort((a, b) => {
              const itemA = a.data[0];
              const itemB = b.data[0];

              return sortByTime(itemA, itemB);
            });

          setSections(groupedSections);
        } catch (e) {
          logger.sentry('Error setting transaction sections data', e);
        }

        setLoading(false);
      } else if (isEmpty) {
        setSections([]);
      }
    };

    setSectionsData();
  }, [
    currencyConversionRates,
    nativeCurrency,
    accountAddress,
    transactions,
    isEmpty,
    merchantSafeAddress,
    depot,
    transactionStrategies,
    merchantSafes,
    prepaidCards,
    prevLastTransaction,
    currentLastTransaction,
  ]);

  const isLoading = networkStatus === NetworkStatus.loading || loading;
  const isFetchingMore = sections.length && isLoading;

  const onEndReached = useCallback(() => {
    if (!isFetchingMore && fetchMore) {
      fetchMore({
        variables: {
          skip: transactionsCount,
        },
      });
    }
  }, [fetchMore, isFetchingMore, transactionsCount]);

  return useMemo(
    () => ({
      loading: isLoading && !isFetchingMore,
      isFetchingMore,
      onEndReached,
      sections,
    }),
    [isFetchingMore, isLoading, onEndReached, sections]
  );
};
