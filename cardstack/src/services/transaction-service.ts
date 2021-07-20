import { NetworkStatus } from '@apollo/client';
import { groupBy } from 'lodash';
import { useEffect, useState } from 'react';
import { getApolloClient } from '../graphql/apollo-client';
import { CurrencyConversionRates } from '../types/CurrencyConversionRates';
import { mapAndSortTransactions } from './transaction-mapping-service';
import {
  TransactionFragment,
  useGetTransactionHistoryDataQuery,
} from '@cardstack/graphql';
import { groupTransactionsByDate, isLayer1 } from '@cardstack/utils';
import { useAccountTransactions } from '@rainbow-me/hooks';
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
  } = useGetTransactionHistoryDataQuery({
    client,
    notifyOnNetworkStatusChange: true,
    skip: !accountAddress || network !== networkTypes.sokol,
    variables: {
      address: accountAddress,
    },
  });

  if (error) {
    logger.log('Error getting Sokol transactions', error);
  }

  useEffect(() => {
    const setSectionsData = async () => {
      if (data?.account?.transactions) {
        setLoading(true);

        try {
          const transactions = data.account.transactions.reduce<
            TransactionFragment[]
          >((accum, t) => {
            if (t) {
              return [...accum, t.transaction];
            }

            return accum;
          }, []);

          const mappedTransactions = await mapAndSortTransactions(
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
              data: groupedData[title],
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
      }
    };

    setSectionsData();
  }, [currencyConversionRates, data, nativeCurrency, accountAddress]);

  return {
    isLoadingTransactions: networkStatus === NetworkStatus.loading || loading,
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
  }

  return layer2Data;
};
