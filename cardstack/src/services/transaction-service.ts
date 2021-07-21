import { NetworkStatus } from '@apollo/client';
import { groupBy } from 'lodash';
import { useEffect, useState } from 'react';
import { getApolloClient } from '../graphql/apollo-client';
import { CurrencyConversionRates } from '../types/CurrencyConversionRates';
import { mapLayer2Transactions } from './transaction-mapping-service';
import {
  TransactionFragment,
  useGetTransactionHistoryDataQuery,
} from '@cardstack/graphql';
import { groupTransactionsByDate, isLayer1 } from '@cardstack/utils';
import { useAccountTransactions, usePrevious } from '@rainbow-me/hooks';
import { networkTypes } from '@rainbow-me/networkTypes';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import logger from 'logger';

const sortByTime = (a: any, b: any) => {
  const timeA = Number(a.timestamp || a.minedAt || a.createdAt);
  const timeB = Number(b.timestamp || b.minedAt || b.createdAt);

  return timeB - timeA;
};

const useSokolTransactions = () => {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [fetchMoreLoading, setFetchMoreLoading] = useState(false);

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
    data,
    error,
    refetch,
    networkStatus,
    fetchMore,
  } = useGetTransactionHistoryDataQuery({
    client,
    notifyOnNetworkStatusChange: true,
    skip: !accountAddress || network !== networkTypes.sokol,
    variables: {
      address: accountAddress,
    },
  });

  const prevFetchMore = usePrevious(networkStatus === NetworkStatus.fetchMore);

  if (error) {
    logger.error('Error getting Sokol transactions', error);
  }

  useEffect(() => {
    const newCount = data?.account?.transactions.length || count;

    if (newCount !== count) {
      setCount(newCount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    const setSectionsData = async () => {
      if (data?.account?.transactions) {
        if (prevFetchMore) {
          setFetchMoreLoading(true);
        } else {
          setLoading(true);
        }

        try {
          const transactions = data.account.transactions.reduce<
            TransactionFragment[]
          >((accum, t) => {
            if (t) {
              return [...accum, t.transaction];
            }

            return accum;
          }, []);

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

        setFetchMoreLoading(false);
        setLoading(false);
      }
    };

    setSectionsData();
  }, [
    currencyConversionRates,
    data,
    nativeCurrency,
    accountAddress,
    prevFetchMore,
  ]);

  return {
    count,
    isLoadingTransactions: networkStatus === NetworkStatus.loading || loading,
    fetchMore,
    shouldFetchMore: (data?.account?.transactions.length || 0) > count,
    fetchMoreLoading:
      networkStatus === NetworkStatus.fetchMore || fetchMoreLoading,
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
      count: 0,
      fetchMore: () => ({}),
      fetchMoreLoading: false,
      refetch: () => ({}),
      refetchLoading: false,
    };
  }

  return layer2Data;
};
