import { NetworkStatus } from '@apollo/client';
import {
  convertRawAmountToBalance,
  convertRawAmountToNativeDisplay,
} from '@cardstack/cardpay-sdk';
import { groupBy } from 'lodash';
import { CurrencyConversionRates } from '../types/CurrencyConversionRates';
import {
  sokolClient,
  BridgeEventFragment,
  PrepaidCardCreationFragment,
  TransactionFragment,
  useGetTransactionHistoryDataQuery,
} from '@cardstack/graphql';
import {
  BridgedTokenTransactionType,
  CreatedPrepaidCardTransactionType,
  TransactionTypes,
  TransactionType,
} from '@cardstack/types';
import {
  convertSpendForBalanceDisplay,
  groupTransactionsByDate,
  isLayer1,
} from '@cardstack/utils';
import { useAccountTransactions } from '@rainbow-me/hooks';
import { networkTypes } from '@rainbow-me/networkTypes';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import logger from 'logger';

const DEFAULT_ASSET = {
  decimals: 18,
  symbol: 'DAI',
};

const sortByTime = (a: any, b: any) => {
  const timeA = a.timestamp || a.minedAt || a.createdAt;
  const timeB = b.timestamp || b.minedAt || a.createdAt;

  return timeB - timeA;
};

const mapBridgeEventTransaction = (
  transaction: BridgeEventFragment,
  transactionHash: string,
  nativeCurrency: string
): BridgedTokenTransactionType => {
  return {
    balance: convertRawAmountToBalance(transaction.amount, {
      decimals: 18,
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      symbol: transaction.token.symbol,
    }),
    native: convertRawAmountToNativeDisplay(
      transaction.amount,
      18,
      1, // TODO: needs to be updated with actual price unit
      nativeCurrency
    ),
    transactionHash,
    to: transaction.depot.id,
    token: {
      address: transaction.token.id,
      symbol: transaction.token.symbol,
      name: transaction.token.name,
    },
    timestamp: transaction.timestamp,
    type: TransactionTypes.BRIDGED,
  };
};

const mapPrepaidCardTransaction = (
  prepaidCardTransaction: PrepaidCardCreationFragment,
  transactionHash: string,
  nativeCurrency: string,
  currencyConversionRates: CurrencyConversionRates
): CreatedPrepaidCardTransactionType => {
  const spendDisplay = convertSpendForBalanceDisplay(
    prepaidCardTransaction.spendAmount,
    nativeCurrency,
    currencyConversionRates,
    true
  );

  return {
    address: prepaidCardTransaction.prepaidCard.id,
    createdAt: prepaidCardTransaction.createdAt,
    spendAmount: prepaidCardTransaction.spendAmount,
    issuingToken: {
      address: prepaidCardTransaction.issuingToken.id,
      symbol: prepaidCardTransaction.issuingToken.symbol,
      name: prepaidCardTransaction.issuingToken.name,
      balance: convertRawAmountToBalance(
        prepaidCardTransaction.issuingTokenAmount,
        DEFAULT_ASSET
      ),
      native: convertRawAmountToNativeDisplay(
        prepaidCardTransaction.issuingTokenAmount,
        18,
        1, // TODO: needs to be updated with actual price unit
        nativeCurrency
      ),
    },
    type: TransactionTypes.CREATED_PREPAID_CARD,
    spendBalanceDisplay: spendDisplay.tokenBalanceDisplay,
    nativeBalanceDisplay: spendDisplay.nativeBalanceDisplay,
    transactionHash,
  };
};

const mapAndSortTransactions = (
  transactions: TransactionFragment[],
  nativeCurrency: string,
  currencyConversionRates: CurrencyConversionRates
) => {
  const mappedTransactions = transactions.reduce<TransactionType[]>(
    (accum, transaction) => {
      const { prepaidCardCreations, bridgeEvents } = transaction;

      if (prepaidCardCreations[0]) {
        const mappedPrepaidCardCreation = mapPrepaidCardTransaction(
          prepaidCardCreations[0],
          transaction.id,
          nativeCurrency,
          currencyConversionRates
        );

        return [...accum, mappedPrepaidCardCreation];
      } else if (bridgeEvents[0]) {
        const mappedBridgeEvent = mapBridgeEventTransaction(
          bridgeEvents[0],
          transaction.id,
          nativeCurrency
        );

        return [...accum, mappedBridgeEvent];
      }

      return accum;
    },
    []
  );

  return mappedTransactions.sort(sortByTime);
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

  const {
    data,
    error,
    refetch,
    networkStatus,
  } = useGetTransactionHistoryDataQuery({
    client: sokolClient,
    notifyOnNetworkStatusChange: true,
    skip: !accountAddress || network !== networkTypes.sokol,
    variables: {
      address: accountAddress,
    },
  });

  console.log({ data: JSON.stringify(data, null, 2) });

  if (error) {
    logger.log('Error getting Sokol transactions', error);
  }

  const transactions =
    data?.account?.transactions.reduce<TransactionFragment[]>((accum, t) => {
      if (t) {
        return [...accum, t.transaction];
      }

      return accum;
    }, []) || [];

  const mappedTransactions = mapAndSortTransactions(
    transactions,
    nativeCurrency,
    currencyConversionRates
  );

  const groupedData = groupBy(mappedTransactions, groupTransactionsByDate);

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
