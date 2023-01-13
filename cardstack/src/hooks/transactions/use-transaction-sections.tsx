import { NetworkStatus } from '@apollo/client';
import { groupBy } from 'lodash';
import { useCallback, useEffect, useState } from 'react';

import { TRANSACTION_PAGE_SIZE } from '@cardstack/constants';
import { useGetSafesDataQuery } from '@cardstack/services';
import {
  TransactionMappingContext,
  TransactionMappingStrategy,
} from '@cardstack/transaction-mapping-strategies/context';
import {
  groupTransactionsByDate,
  merchantRevenueEventsToTransactions,
  sortByTime,
} from '@cardstack/utils';

import { useAccountSettings } from '@rainbow-me/hooks';
import usePrevious from '@rainbow-me/hooks/usePrevious';
import logger from 'logger';

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
  transactions = [],
  isEmpty,
  transactionsCount,
  networkStatus,
  fetchMore,
  merchantSafeAddress,
  transactionStrategies,
  isMerchantTransaction = false,
  isDepotTransaction = false,
}: UseTransactionSectionsProps) => {
  const {
    nativeCurrency,
    accountAddress,
    isOnCardPayNetwork,
  } = useAccountSettings();

  const [sections, setSections] = useState<any[]>([]);
  const [isMappingTx, setIsMappingTx] = useState(false);

  const {
    prepaidCards,
    depots: [depot],
    merchantSafes,
    isLoading: isLoadingSafes,
  } = useGetSafesDataQuery(
    { address: accountAddress, nativeCurrency },

    {
      selectFromResult: ({ data, ...rest }) => ({
        prepaidCards: data?.prepaidCards || [],
        depots: data?.depots || [],
        merchantSafes: data?.merchantSafes || [],
        ...rest,
      }),
      skip: !isOnCardPayNetwork,
    }
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
    didNativeCurrencyChanged ||
    !sections.length;

  const isLoading =
    networkStatus === NetworkStatus.loading || isMappingTx || isLoadingSafes;

  useEffect(() => {
    const setSectionsData = async () => {
      if (isLoading || isEmpty) {
        return;
      }

      if (shouldUpdate) {
        setIsMappingTx(true);

        try {
          const merchantSafeAddresses = merchantSafes?.map(
            (safe: { address: string }) => safe.address
          );

          const prepaidCardAddresses = prepaidCards?.map(
            (safe: { address: string }) => safe.address
          );

          const transactionMappingContext = new TransactionMappingContext({
            transactions: merchantSafeAddress
              ? merchantRevenueEventsToTransactions(transactions as any[])
              : transactions.map((t: any) => t?.transaction),
            accountAddress: accountAddress,
            nativeCurrency,
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
      }

      setIsMappingTx(false);
    };

    setSectionsData();
  }, [
    accountAddress,
    depot?.address,
    isDepotTransaction,
    isEmpty,
    isLoading,
    merchantSafeAddress,
    merchantSafes,
    nativeCurrency,
    prepaidCards,
    shouldUpdate,
    transactionStrategies,
    transactions,
  ]);

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
