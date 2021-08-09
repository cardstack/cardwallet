import { NetworkStatus } from '@apollo/client';
import { groupBy } from 'lodash';
import { useEffect, useState } from 'react';
import { TRANSACTION_PAGE_SIZE } from '../../constants';
import { useRainbowSelector } from '../../../../src/redux/hooks';
import { getApolloClient } from '../../graphql/apollo-client';
import { CurrencyConversionRates } from '../../types/CurrencyConversionRates';
import { useGetAccountTransactionHistoryDataQuery } from '@cardstack/graphql';
import { mapLayer2Transactions } from '@cardstack/services';
import {
  groupTransactionsByDate,
  isLayer1,
  sortByTime,
} from '@cardstack/utils';
import { useAccountTransactions } from '@rainbow-me/hooks';
import { networkTypes } from '@rainbow-me/networkTypes';
import logger from 'logger';

const useSokolTransactions = () => {
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
  } = useGetAccountTransactionHistoryDataQuery({
    client,
    notifyOnNetworkStatusChange: true,
    skip: isNotSokol,
    variables: {
      address: accountAddress,
      pageSize: TRANSACTION_PAGE_SIZE,
    },
  });

  const account = data?.account;
  const transactions = account?.transactions;

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

export const useFullTransactionList = () => {
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
