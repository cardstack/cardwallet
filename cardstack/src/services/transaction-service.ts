import { NetworkStatus } from '@apollo/client';
import { groupBy } from 'lodash';
import { useEffect, useState } from 'react';

import { useRainbowSelector } from '../../../src/redux/hooks';
import { getApolloClient } from '../graphql/apollo-client';
import { CurrencyConversionRates } from '../types/CurrencyConversionRates';
import { mapLayer2Transactions } from './transaction-mapping-service';
import logger from 'logger';
import { networkTypes } from '@rainbow-me/networkTypes';
import { useAccountTransactions } from '@rainbow-me/hooks';
import { groupTransactionsByDate, isLayer1 } from '@cardstack/utils';
import {
  useGetAccountTransactionHistoryDataQuery,
  useGetSafeTransactionHistoryDataQuery,
} from '@cardstack/graphql';

const PAGE_SIZE = 100;

const sortByTime = (a: any, b: any) => {
  const timeA = Number(a.timestamp || a.minedAt || a.createdAt);
  const timeB = Number(b.timestamp || b.minedAt || b.createdAt);

  return timeB - timeA;
};

const useTransactionData = (
  client: any,
  accountAddress: string,
  safeAddress?: string
) => {
  const network = useRainbowSelector(state => state.settings.network);
  const isSafeQuery = Boolean(safeAddress);
  const isNotSokol = network !== networkTypes.sokol;
  const shouldSkipAccountQuery = !accountAddress || isSafeQuery || isNotSokol;
  const shouldSkipSafeQuery = Boolean(!safeAddress || isNotSokol);

  const accountQueryResponse = useGetAccountTransactionHistoryDataQuery({
    client,
    notifyOnNetworkStatusChange: true,
    skip: shouldSkipAccountQuery,
    variables: {
      address: accountAddress,
      pageSize: PAGE_SIZE,
    },
  });

  const safeQueryResponse = useGetSafeTransactionHistoryDataQuery({
    client,
    notifyOnNetworkStatusChange: true,
    skip: shouldSkipSafeQuery,
    variables: {
      address: safeAddress,
      pageSize: PAGE_SIZE,
    },
  });

  if (isSafeQuery) {
    return {
      account: safeQueryResponse.data?.safe,
      transactions: safeQueryResponse.data?.safe?.safeTxns,
      ...safeQueryResponse,
    };
  }

  return {
    account: accountQueryResponse.data?.account,
    transactions: accountQueryResponse.data?.account?.transactions,
    ...accountQueryResponse,
  };
};

const useSokolTransactions = (safeAddress?: string) => {
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

  const client = getApolloClient(network);

  const {
    account,
    transactions,
    networkStatus,
    fetchMore,
    refetch,
    error,
  } = useTransactionData(client, accountAddress, safeAddress);

  if (error) {
    logger.log('Error getting Sokol transactions', error);
  }

  useEffect(() => {
    const setSectionsData = async () => {
      if (transactions) {
        setLoading(true);

        try {
          const mappedTransactions = await mapLayer2Transactions(
            transactions.map(t => t?.transaction),
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
      } else if (account === null) {
        setSections([]);
      }
    };

    setSectionsData();
  }, [
    currencyConversionRates,
    nativeCurrency,
    accountAddress,
    transactions,
    account,
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

export const useTransactions = (safeAddress?: string) => {
  const network = useRainbowSelector(state => state.settings.network);
  const layer1Data = useAccountTransactions();
  const layer2Data = useSokolTransactions(safeAddress);

  if (isLayer1(network)) {
    return {
      ...layer1Data,
      refetch: () => ({}),
      refetchLoading: false,
    };
  } else if (network === networkTypes.sokol) {
    return layer2Data;
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
