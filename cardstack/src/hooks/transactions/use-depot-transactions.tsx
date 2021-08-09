import { NetworkStatus } from '@apollo/client';
import { groupBy } from 'lodash';
import { useEffect, useState } from 'react';

import { useRainbowSelector } from '../../../../src/redux/hooks';
import { TRANSACTION_PAGE_SIZE } from '../../constants';
import { getApolloClient } from '../../graphql/apollo-client';
import { CurrencyConversionRates } from '../../types/CurrencyConversionRates';
import logger from 'logger';
import { networkTypes } from '@rainbow-me/networkTypes';
import { groupTransactionsByDate, sortByTime } from '@cardstack/utils';
import { mapLayer2Transactions } from '@cardstack/services';
import { useGetSafeTransactionHistoryDataQuery } from '@cardstack/graphql';

export const useDepotTransactions = (safeAddress: string) => {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [
    accountAddress,
    network,
    nativeCurrency,
    currencyConversionRates,
  ] = useRainbowSelector<[string, string, string, CurrencyConversionRates]>(
    state => [
      state.settings.accountAddress,
      state.settings.network,
      state.settings.nativeCurrency,
      state.currencyConversion.rates,
    ]
  );

  const isNotSokol = network !== networkTypes.sokol;

  const client = getApolloClient(network);

  const {
    data,
    networkStatus,
    fetchMore,
    refetch,
    error,
  } = useGetSafeTransactionHistoryDataQuery({
    client,
    notifyOnNetworkStatusChange: true,
    skip: isNotSokol,
    variables: {
      address: safeAddress,
      pageSize: TRANSACTION_PAGE_SIZE,
    },
  });

  const safe = data?.safe;
  const transactions = safe?.safeTxns;

  if (error) {
    logger.log('Error getting Sokol transactions', error);
  }

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
      } else if (safe === null) {
        setSections([]);
      }
    };

    setSectionsData();
  }, [
    currencyConversionRates,
    nativeCurrency,
    accountAddress,
    transactions,
    safe,
  ]);

  const transactionsCount = transactions?.length || 0;
  const isLoading = networkStatus === NetworkStatus.loading || loading;
  const isFetchingMore = sections.length && isLoading;

  return {
    isLoadingTransactions: isLoading && !isFetchingMore,
    isFetchingMore,
    onEndReached: () => {
      if (!isFetchingMore && fetchMore) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore it gets confused because fetchMore could come from either query, but they both use this variable
        fetchMore({
          variables: {
            skip: transactionsCount,
          },
        });
      }
    },
    refetch,
    refetchLoading: networkStatus === NetworkStatus.refetch,
    sections: sections,
  };
};
