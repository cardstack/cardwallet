import { groupBy } from 'lodash';
import { getTransactionHistoryData, sokolClient } from '@cardstack/graphql';
import { useQuery } from '@apollo/client';
import {
  convertRawAmountToBalance,
  convertRawAmountToNativeDisplay,
} from '@cardstack/cardpay-sdk';
import { networkTypes } from '@rainbow-me/networkTypes';
import { groupTransactionsByDate, isLayer1 } from '@cardstack/utils';
import { useAccountTransactions } from '@rainbow-me/hooks';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import logger from 'logger';
import { TransactionType } from '@cardstack/types';

const sortByTime = (a: any, b: any) => {
  const timeA = a.timestamp || a.minedAt;
  const timeB = b.timestamp || b.minedAt;

  return timeB - timeA;
};

const getBridgedTransactions = (data: any, nativeCurrency: string) => {
  if (!data || !data.account) {
    return [];
  }

  const { receivedBridgedTokens } = data.account;

  return receivedBridgedTokens.map((token: any) => ({
    ...token,
    balance: convertRawAmountToBalance(token.amount, {
      decimals: 18,
    }),
    native: convertRawAmountToNativeDisplay(
      token.amount,
      18,
      1, // needs to be updated with actual price unit
      nativeCurrency
    ),
    to: token.depot.id,
    token: token.token,
    timestamp: token.timestamp,
    type: TransactionType.BRIDGED,
  }));
};

const useSokolTransactions = () => {
  const [
    accountAddress,
    network,
    nativeCurrency,
  ] = useRainbowSelector(state => [
    state.settings.accountAddress,
    state.settings.network,
    state.settings.nativeCurrency,
  ]);

  const transactions = useRainbowSelector(state => state.data.transactions);

  const { data, loading, error } = useQuery(getTransactionHistoryData, {
    client: sokolClient,
    skip: !accountAddress || network !== networkTypes.sokol,
    variables: {
      address: accountAddress,
    },
  });

  console.log({ data: JSON.stringify(data, null, 2) });

  if (error) {
    logger.log('Error getting Sokol transactions', error);
  }

  const bridgedTransactions = getBridgedTransactions(data, nativeCurrency);

  const groupedData = groupBy(
    [...transactions, ...bridgedTransactions].sort(sortByTime),
    groupTransactionsByDate
  );

  const sections = Object.keys(groupedData)
    .map(title => ({
      data: groupedData[title],
      title,
    }))
    .sort((a, b) => {
      const itemA = a.data[0];
      const itemB = b.data[0];

      return sortByTime(itemA, itemB);
    });

  return {
    isLoadingTransactions: loading,
    sections: sections,
  };
};

export const useTransactions = () => {
  const network = useRainbowSelector(state => state.settings.network);
  const layer1Data = useAccountTransactions();
  const layer2Data = useSokolTransactions();

  if (isLayer1(network)) {
    return layer1Data;
  }

  return layer2Data;
};
