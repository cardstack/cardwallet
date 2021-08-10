import { useCallback, useEffect, useState } from 'react';
import { groupBy } from 'lodash';
import { NetworkStatus } from '@apollo/client';
import {
  useNativeCurrencyAndConversionRates,
  useRainbowSelector,
} from '@rainbow-me/redux/hooks';
import logger from 'logger';
import { mapLayer2Transactions } from '@cardstack/services';
import { groupTransactionsByDate, sortByTime } from '@cardstack/utils';

interface UseTransactionSectionsProps {
  transactions: ({ transaction: any } | null | undefined)[] | undefined;
  isEmpty?: boolean;
  transactionsCount: number;
  networkStatus: NetworkStatus;
  fetchMore?: (props: any) => void;
}

export const useTransactionSections = ({
  transactions,
  isEmpty,
  transactionsCount,
  networkStatus,
  fetchMore,
}: UseTransactionSectionsProps) => {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [
    nativeCurrency,
    currencyConversionRates,
  ] = useNativeCurrencyAndConversionRates();

  const accountAddress = useRainbowSelector(
    state => state.settings.accountAddress
  );

  useEffect(() => {
    const setSectionsData = async () => {
      if (transactions) {
        setLoading(true);

        try {
          const mappedTransactions = await mapLayer2Transactions(
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore getting mad about the union type
            transactions.map((t: any) => t?.transaction),
            accountAddress,
            nativeCurrency,
            currencyConversionRates
          );

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
          logger.log('Error setting sections data', e);
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

  return {
    loading: isLoading && !isFetchingMore,
    isFetchingMore,
    onEndReached,
    sections,
  };
};
