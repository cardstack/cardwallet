import { groupBy } from 'lodash';
import { NetworkStatus, useQuery } from '@apollo/client';
import {
  convertRawAmountToBalance,
  convertRawAmountToNativeDisplay,
} from '@cardstack/cardpay-sdk';
import { CurrencyConversionRates } from './../types/CurrencyConversionRates';
import { getTransactionHistoryData, sokolClient } from '@cardstack/graphql';
import { networkTypes } from '@rainbow-me/networkTypes';
import {
  groupTransactionsByDate,
  isLayer1,
  convertSpendForBalanceDisplay,
} from '@cardstack/utils';
import { useAccountTransactions } from '@rainbow-me/hooks';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import logger from 'logger';
import {
  TransactionType,
  BridgedTokenTransactionType,
  CreatedPrepaidCardTransactionType,
} from '@cardstack/types';

const DEFAULT_ASSET = {
  decimals: 18,
  symbol: 'DAI',
};

const sortByTime = (a: any, b: any) => {
  const timeA = a.timestamp || a.minedAt || a.createdAt;
  const timeB = b.timestamp || b.minedAt || a.createdAt;

  return timeB - timeA;
};

const getBridgedTransactions = (
  data: any,
  nativeCurrency: string
): BridgedTokenTransactionType[] => {
  if (!data || !data.account) {
    return [];
  }

  const { receivedBridgedTokens } = data.account;

  return receivedBridgedTokens.map((token: any) => ({
    balance: convertRawAmountToBalance(token.amount, DEFAULT_ASSET),
    native: convertRawAmountToNativeDisplay(
      token.amount,
      18,
      1, // needs to be updated with actual price unit
      nativeCurrency
    ),
    transactionHash: token.transaction.id,
    to: token.depot.id,
    token: token.token,
    timestamp: token.timestamp,
    type: TransactionType.BRIDGED,
  }));
};

const getPrepaidCardTransactions = (
  data: any,
  nativeCurrency: string,
  currencyConversionRates: CurrencyConversionRates
): CreatedPrepaidCardTransactionType[] => {
  if (!data || !data.account) {
    return [];
  }

  const { createdPrepaidCards } = data.account;

  return createdPrepaidCards.map((transaction: any) => {
    const spendDisplay = convertSpendForBalanceDisplay(
      transaction.spendAmount,
      nativeCurrency,
      currencyConversionRates,
      true
    );

    return {
      address: transaction.prepaidCard.id,
      createdAt: transaction.createdAt,
      spendAmount: transaction.spendAmount,
      issuingToken: {
        address: transaction.issuingToken,
        balance: convertRawAmountToBalance(
          transaction.issuingTokenAmount,
          DEFAULT_ASSET
        ),
        native: convertRawAmountToNativeDisplay(
          transaction.issuingTokenAmount,
          18,
          1, // needs to be updated with actual price unit
          nativeCurrency
        ),
      },
      type: TransactionType.CREATED_PREPAID_CARD,
      spendBalanceDisplay: spendDisplay.tokenBalanceDisplay,
      nativeBalanceDisplay: spendDisplay.nativeBalanceDisplay,
      transactionHash: transaction.transaction.id,
    };
  });
};

const useSokolTransactions = () => {
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

  const transactions = useRainbowSelector(state => state.data.transactions);

  const { data, error, refetch, networkStatus } = useQuery(
    getTransactionHistoryData,
    {
      client: sokolClient,
      notifyOnNetworkStatusChange: true,
      skip: !accountAddress || network !== networkTypes.sokol,
      variables: {
        address: accountAddress,
      },
    }
  );

  if (error) {
    logger.log('Error getting Sokol transactions', error);
  }

  const bridgedTransactions = getBridgedTransactions(data, nativeCurrency);

  const prepaidCardTransactions = getPrepaidCardTransactions(
    data,
    nativeCurrency,
    currencyConversionRates
  );

  const groupedData = groupBy(
    [...transactions, ...bridgedTransactions, ...prepaidCardTransactions].sort(
      sortByTime
    ),
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
    isLoadingTransactions: networkStatus === NetworkStatus.loading,
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
