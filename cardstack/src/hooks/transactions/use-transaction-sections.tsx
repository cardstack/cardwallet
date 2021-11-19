import { useCallback, useEffect, useState } from 'react';
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
import { TRANSACTION_PAGE_SIZE } from '@cardstack/constants';

interface UseTransactionSectionsProps {
  transactions: ({ transaction: any } | null | undefined)[] | undefined;
  isEmpty?: boolean;
  transactionsCount: number;
  networkStatus: NetworkStatus;
  fetchMore?: (props: any) => void;
  merchantSafeAddress?: string;
  transactionStrategies?: TransactionMappingStrategy[];
  isMerchantTransaction?: boolean;
  isDepotTransaction?: boolean;
}

export const useTransactionSections = ({
  transactions,
  isEmpty,
  transactionsCount,
  networkStatus,
  fetchMore,
  merchantSafeAddress,
  transactionStrategies,
  isMerchantTransaction = false,
  isDepotTransaction = false,
}: UseTransactionSectionsProps) => {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // TODO: Replace with RTK
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

  const prevLastestTx = usePrevious(transactions?.[0]?.transaction?.id);
  const currentLastestTx = transactions?.[0]?.transaction?.id;

  const prevTxLength = usePrevious(transactions?.length) || 0;
  const currentTxLength = transactions?.length || 0;

  const isPagination =
    prevLastestTx === currentLastestTx && currentTxLength > prevTxLength;

  const isNewtx = prevLastestTx !== currentLastestTx;
  const isInitialTx = !prevLastestTx;

  const previousNativeCurrency = usePrevious(nativeCurrency);

  const didNativeCurrencyChanged = previousNativeCurrency !== nativeCurrency;

  // Quick workaround to have merchant tx working
  // TODO: refactor and add tests
  const shouldUpdate =
    isInitialTx ||
    isNewtx ||
    isPagination ||
    isMerchantTransaction ||
    didNativeCurrencyChanged;

  useEffect(() => {
    const setSectionsData = async () => {
      if (transactions && shouldUpdate) {
        setLoading(true);

        try {
          const merchantSafeAddresses = merchantSafes?.map(
            safe => safe.address
          );

          const prepaidCardAddresses = prepaidCards?.map(safe => safe.address);

          const transactionMappingContext = new TransactionMappingContext({
            transactions: merchantSafeAddress
              ? merchantRevenueEventsToTransactions(transactions as any[])
              : transactions.map((t: any) => t?.transaction),
            accountAddress: accountAddress,
            nativeCurrency,
            currencyConversionRates,
            transactionStrategies,
            depotAddress: depot?.address,
            merchantSafeAddresses,
            prepaidCardAddresses,
            merchantSafeAddress,
            isDepotTransaction,
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
    shouldUpdate,
    isDepotTransaction,
  ]);

  const isLoading = networkStatus === NetworkStatus.loading || loading;
  const isFetchingMore = !!sections.length && isLoading;

  const onEndReached = useCallback(() => {
    if (
      !isFetchingMore &&
      fetchMore &&
      transactionsCount >= TRANSACTION_PAGE_SIZE
    ) {
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
