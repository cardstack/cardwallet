import {
  NetworkStatus,
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import {
  convertRawAmountToBalance,
  convertRawAmountToNativeDisplay,
  getConstantByNetwork,
} from '@cardstack/cardpay-sdk';
import { groupBy } from 'lodash';
import { useState, useEffect } from 'react';
import { CurrencyConversionRates } from '../types/CurrencyConversionRates';
import {
  MerchantCreationFragment,
  TokenTransferFragment,
  PrepaidCardPaymentFragment,
} from './../graphql/graphql-codegen';
import { fetchHistoricalPrice } from './historical-pricing-service';

import {
  BridgeEventFragment,
  PrepaidCardCreationFragment,
  TransactionFragment,
  useGetTransactionHistoryDataQuery,
} from '@cardstack/graphql';
import {
  BridgedTokenTransactionType,
  CreatedPrepaidCardTransactionType,
  PrepaidCardPaymentTransactionType,
  TransactionTypes,
  TransactionType,
  MerchantCreationTransactionType,
  TransactionItemType,
  TransactionStatus,
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

const sortByTime = (a: any, b: any) => {
  const timeA = Number(a.timestamp || a.minedAt || a.createdAt);
  const timeB = Number(b.timestamp || b.minedAt || b.createdAt);

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

const mapPrepaidCardTransaction = async (
  prepaidCardTransaction: PrepaidCardCreationFragment,
  transactionHash: string,
  nativeCurrency: string,
  currencyConversionRates: CurrencyConversionRates
): Promise<CreatedPrepaidCardTransactionType> => {
  const spendDisplay = convertSpendForBalanceDisplay(
    prepaidCardTransaction.spendAmount,
    nativeCurrency,
    currencyConversionRates,
    true
  );

  let price = 0;

  if (prepaidCardTransaction.issuingToken.symbol) {
    price = await fetchHistoricalPrice(
      prepaidCardTransaction.issuingToken.symbol || '',
      prepaidCardTransaction.createdAt,
      nativeCurrency
    );
  }

  return {
    address: prepaidCardTransaction.prepaidCard.id,
    createdAt: prepaidCardTransaction.createdAt,
    createdFromAddress: prepaidCardTransaction.createdFromAddress,
    spendAmount: prepaidCardTransaction.spendAmount,
    issuingToken: {
      address: prepaidCardTransaction.issuingToken.id,
      symbol: prepaidCardTransaction.issuingToken.symbol,
      name: prepaidCardTransaction.issuingToken.name,
      balance: convertRawAmountToBalance(
        prepaidCardTransaction.issuingTokenAmount,
        {
          decimals: 18,
          symbol: prepaidCardTransaction.issuingToken.symbol || '',
        }
      ),
      native: convertRawAmountToNativeDisplay(
        prepaidCardTransaction.issuingTokenAmount,
        18,
        price,
        nativeCurrency
      ),
    },
    type: TransactionTypes.CREATED_PREPAID_CARD,
    spendBalanceDisplay: spendDisplay.tokenBalanceDisplay,
    nativeBalanceDisplay: spendDisplay.nativeBalanceDisplay,
    transactionHash,
  };
};

const mapPrepaidCardPaymentTransaction = (
  prepaidCardPaymentTransaction: PrepaidCardPaymentFragment,
  transactionHash: string,
  nativeCurrency: string,
  currencyConversionRates: CurrencyConversionRates
): PrepaidCardPaymentTransactionType => {
  const spendDisplay = convertSpendForBalanceDisplay(
    prepaidCardPaymentTransaction.spendAmount,
    nativeCurrency,
    currencyConversionRates,
    true
  );

  return {
    address: prepaidCardPaymentTransaction.prepaidCard.id,
    timestamp: prepaidCardPaymentTransaction.timestamp,
    spendAmount: prepaidCardPaymentTransaction.spendAmount,
    type: TransactionTypes.PREPAID_CARD_PAYMENT,
    spendBalanceDisplay: spendDisplay.tokenBalanceDisplay,
    nativeBalanceDisplay: spendDisplay.nativeBalanceDisplay,
    transactionHash,
  };
};

const mapMerchantCreationTransaction = (
  merchantCreationTransaction: MerchantCreationFragment,
  transactionHash: string
): MerchantCreationTransactionType => {
  return {
    address: merchantCreationTransaction.id,
    createdAt: merchantCreationTransaction.createdAt,
    infoDid: merchantCreationTransaction.merchantSafe.infoDid,
    transactionHash,
    type: TransactionTypes.MERCHANT_CREATION,
  };
};

const getStatusAndTitle = (
  transfer: TokenTransferFragment,
  accountAddress: string
): {
  status: TransactionStatus;
  title: string;
} => {
  if (transfer.to === accountAddress) {
    return {
      status: TransactionStatus.received,
      title: 'Received',
    };
  }

  return {
    status: TransactionStatus.sent,
    title: 'Sent',
  };
};

const mapERC20TokenTransactions = async (
  tokenTransfers: TokenTransferFragment[],
  transactionHash: string,
  accountAddress: string,
  nativeCurrency: string
): Promise<TransactionItemType | null> => {
  const userTransaction = tokenTransfers.find(
    transfer =>
      transfer.to === accountAddress || transfer.from === accountAddress
  );

  if (!userTransaction) {
    return null;
  }

  const { status, title } = getStatusAndTitle(userTransaction, accountAddress);

  let price = 0;

  const symbol = userTransaction.token.symbol || '';

  if (symbol) {
    price = await fetchHistoricalPrice(
      symbol,
      userTransaction.timestamp,
      nativeCurrency
    );
  }

  return {
    from: userTransaction.from || 'Unknown',
    to: userTransaction.to || 'Unknown',
    balance: convertRawAmountToBalance(userTransaction.amount, {
      decimals: 18,
      symbol,
    }),
    native: convertRawAmountToNativeDisplay(
      userTransaction.amount,
      18,
      price,
      nativeCurrency
    ),
    minedAt: userTransaction.timestamp,
    hash: transactionHash,
    symbol,
    status,
    title,
  };
};

const mapAndSortTransactions = async (
  transactions: TransactionFragment[],
  accountAddress: string,
  nativeCurrency: string,
  currencyConversionRates: CurrencyConversionRates
) => {
  const mappedTransactions = await Promise.all(
    transactions.map<Promise<TransactionType | null>>(
      async (transaction: TransactionFragment) => {
        const {
          prepaidCardCreations,
          bridgeEvents,
          merchantCreations,
          tokenTransfers,
          prepaidCardPayments,
        } = transaction;

        if (prepaidCardCreations[0]) {
          const mappedPrepaidCardCreation = await mapPrepaidCardTransaction(
            prepaidCardCreations[0],
            transaction.id,
            nativeCurrency,
            currencyConversionRates
          );

          return mappedPrepaidCardCreation;
        } else if (prepaidCardPayments[0]) {
          const mappedPrepaidCardPayments = mapPrepaidCardPaymentTransaction(
            prepaidCardPayments[0],
            transaction.id,
            nativeCurrency,
            currencyConversionRates
          );

          return mappedPrepaidCardPayments;
        } else if (bridgeEvents[0]) {
          const mappedBridgeEvent = mapBridgeEventTransaction(
            bridgeEvents[0],
            transaction.id,
            nativeCurrency
          );

          return mappedBridgeEvent;
        } else if (merchantCreations[0]) {
          return mapMerchantCreationTransaction(
            merchantCreations[0],
            transaction.id
          );
        } else if (tokenTransfers && tokenTransfers.length) {
          return mapERC20TokenTransactions(
            tokenTransfers as TokenTransferFragment[],
            transaction.id,
            accountAddress,
            nativeCurrency
          );
        }

        return null;
      },
      []
    )
  );

  return mappedTransactions.filter(t => t).sort(sortByTime);
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

  const isSokol = network === networkTypes.sokol;

  const subgraphUrl = isSokol
    ? getConstantByNetwork('subgraphURL', network)
    : '';

  console.log({ subgraphUrl });

  const sokolClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: subgraphUrl,
    }),
  });

  const {
    data,
    error,
    refetch,
    networkStatus,
  } = useGetTransactionHistoryDataQuery({
    client: sokolClient,
    notifyOnNetworkStatusChange: true,
    skip: !accountAddress || !isSokol,
    variables: {
      address: accountAddress,
    },
  });

  console.log({ data: JSON.stringify(data, null, 2), error });

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
