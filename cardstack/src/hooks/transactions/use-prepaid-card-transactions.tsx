import { groupBy } from 'lodash';
import { useEffect, useState } from 'react';

import { useRainbowSelector } from '../../../../src/redux/hooks';
import { getApolloClient } from '../../graphql/apollo-client';
import { CurrencyConversionRates } from '../../types/CurrencyConversionRates';
import logger from 'logger';
import { groupTransactionsByDate, sortByTime } from '@cardstack/utils';
import { mapLayer2Transactions } from '@cardstack/services';
import { useGetPrepaidCardHistoryDataQuery } from '@cardstack/graphql';

export const usePrepaidCardTransactions = (prepaidCardAddress: string) => {
  const [sections, setSections] = useState<any[] | null>(null);

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

  const { data, error } = useGetPrepaidCardHistoryDataQuery({
    client,
    variables: {
      address: prepaidCardAddress,
    },
  });

  if (error) {
    logger.log('Error getting prepaid card transactions', error);
  }

  useEffect(() => {
    const setSectionsData = async () => {
      if (data?.safe?.prepaidCard) {
        try {
          const {
            splits,
            transfers,
            payments,
            creation,
          } = data.safe.prepaidCard;

          const transactions = [...splits, ...transfers, ...payments, creation];

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
          setSections([]);

          logger.log('Error setting sections data', e);
        }
      } else if (data?.safe?.prepaidCard === null) {
        setSections([]);
      }
    };

    setSectionsData();
  }, [currencyConversionRates, nativeCurrency, accountAddress, data]);

  return {
    sections: sections,
  };
};
