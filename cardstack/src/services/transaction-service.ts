import { NetworkStatus } from '@apollo/client';
import { groupBy } from 'lodash';
import { useEffect, useState } from 'react';
import { getApolloClient } from '../graphql/apollo-client';
import { CurrencyConversionRates } from '../types/CurrencyConversionRates';
import { mapLayer2Transactions } from './transaction-mapping-service';
import {
  useGetAccountTransactionHistoryDataQuery,
  useGetSafeTransactionHistoryDataQuery,
} from '@cardstack/graphql';
import { groupTransactionsByDate, isLayer1 } from '@cardstack/utils';
import { useAccountTransactions } from '@rainbow-me/hooks';
import { networkTypes } from '@rainbow-me/networkTypes';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import logger from 'logger';

const PAGE_SIZE = 100;

const sortByTime = (a: any, b: any) => {
  const timeA = Number(a.timestamp || a.minedAt || a.createdAt);
  const timeB = Number(b.timestamp || b.minedAt || b.createdAt);

  return timeB - timeA;
};

const useTransactionData = (accountAddress: string, safeAddress?: string) => {
  const network = useRainbowSelector(state => state.settings.network);
  const isSafeQuery = Boolean(safeAddress);
  const client = getApolloClient(network);

  console.log('client', client);

  const accountQueryResponse = useGetAccountTransactionHistoryDataQuery({
    client,
    notifyOnNetworkStatusChange: true,
    skip: !accountAddress || network !== networkTypes.sokol || isSafeQuery,
    variables: {
      address: accountAddress,
      pageSize: PAGE_SIZE,
    },
  });

  console.log('accountQueryResponse', accountQueryResponse);

  const safeQueryResponse = useGetSafeTransactionHistoryDataQuery({
    client,
    notifyOnNetworkStatusChange: true,
    skip: !safeAddress || network !== networkTypes.sokol,
    variables: {
      address: accountAddress,
      pageSize: PAGE_SIZE,
    },
  });

  if (isSafeQuery) {
    return {
      transactions:
        safeQueryResponse.data?.safe?.safeTxns.map(
          safeTxn => safeTxn?.transaction
        ) || [],
      account: safeQueryResponse.data?.safe,
      ...safeQueryResponse,
    };
  }

  return {
    transactions:
      accountQueryResponse.data?.account?.transactions.map(
        txn => txn?.transaction
      ) || [],
    account: accountQueryResponse.data?.account,
    ...accountQueryResponse,
  };
};

const useSokolTransactions = (safeAddress?: string) => {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [
    accountAddress,
    nativeCurrency,
    currencyConversionRates,
  ] = useRainbowSelector<[string, string, CurrencyConversionRates]>(state => [
    state.settings.accountAddress,
    state.settings.nativeCurrency,
    state.currencyConversion.rates,
  ]);

  const {
    account,
    transactions,
    networkStatus,
    fetchMore,
    refetch,
    error,
  } = useTransactionData(accountAddress, safeAddress);

  if (error) {
    logger.log('Error getting Sokol transactions', error);
  }

  useEffect(() => {
    const setSectionsData = async () => {
      if (transactions) {
        setLoading(true);

        try {
          const mappedTransactions = await mapLayer2Transactions(
            transactions,
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
    transactions,
    account,
    nativeCurrency,
    accountAddress,
  ]);

  const transactionsCount = transactions?.length || 0;
  const isLoading = networkStatus === NetworkStatus.loading || loading;
  const isFetchingMore = sections.length && isLoading;

  return {
    isLoadingTransactions: isLoading && !isFetchingMore,
    isFetchingMore,
    onEndReached: () => {
      if (!isFetchingMore) {
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

export const useTransactions = () => {
  const network = useRainbowSelector(state => state.settings.network);
  const layer1Data = useAccountTransactions();
  const layer2Data = useSokolTransactions();

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
