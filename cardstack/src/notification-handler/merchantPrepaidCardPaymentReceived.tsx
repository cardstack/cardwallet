import React from 'react';
import { InteractionManager } from 'react-native';
import {
  convertRawAmountToNativeDisplay,
  convertStringToNumber,
} from '@cardstack/cardpay-sdk';
import { PrepaidCardPayment } from '@cardstack/graphql';
import { Navigation } from '@rainbow-me/navigation';
import { fetchMerchantInfoFromDID } from '@cardstack/utils/merchant-utils';
import { fetchHistoricalPrice } from '@cardstack/services';
import {
  convertSpendForBalanceDisplay,
  getMerchantEarnedTransactionDetails,
} from '@cardstack/utils';
import store from '@rainbow-me/redux/store';
import { MainRoutes } from '@cardstack/navigation/routes';
import { SafeHeader } from '@cardstack/components';
import Logger from 'logger';

export type PrepaidCardPaymentReceivedNotificationBody = Omit<
  PrepaidCardPayment,
  '__typename'
>;

export const merchantPrepaidCardPaymentReceivedHandler = async (
  data: PrepaidCardPaymentReceivedNotificationBody
) => {
  try {
    const transaction = await mapMerchantPaymentTxToNavigationParams(data);
    InteractionManager.runAfterInteractions(async () => {
      Navigation.handleAction(MainRoutes.PAYMENT_RECEIVED_SHEET, {
        transaction,
      });
    });
  } catch (e) {
    Logger.sentry(
      'merchantPrepaidCardPaymentReceivedHandler handling failed - ',
      e
    );
  }
};

export const mapMerchantPaymentTxToNavigationParams = async (
  transactionDetails: PrepaidCardPaymentReceivedNotificationBody
) => {
  const {
    merchantSafe,
    spendAmount,
    issuingToken,
    issuingTokenAmount,
    timestamp,
    prepaidCard,
  } = transactionDetails;

  const merchantInfoDID = await fetchMerchantInfoFromDID(
    merchantSafe?.infoDid || undefined
  );

  const { nativeCurrency } = store.getState().settings;

  const {
    rates: currencyConversionRates,
  } = store.getState().currencyConversion;

  const symbol = issuingToken.symbol || '';

  const price = await fetchHistoricalPrice(symbol, timestamp, nativeCurrency);

  const { nativeBalanceDisplay } = convertSpendForBalanceDisplay(
    spendAmount,
    nativeCurrency,
    currencyConversionRates
  );

  const nativeBalance = convertRawAmountToNativeDisplay(
    issuingTokenAmount,
    18,
    price,
    nativeCurrency
  );

  const earnedTransactionDetails = await getMerchantEarnedTransactionDetails(
    transactionDetails,
    nativeCurrency,
    convertStringToNumber(nativeBalance.amount),
    currencyConversionRates,
    symbol
  );

  const token = {
    address: issuingToken.id,
    symbol: issuingToken.symbol,
    name: issuingToken.name,
  };

  return {
    Header: (
      <SafeHeader
        address={merchantSafe?.id || ''}
        backgroundColor={merchantInfoDID?.color}
        textColor={merchantInfoDID?.textColor}
        rightText={merchantInfoDID?.name || 'Business'}
        small
      />
    ),
    statusIconName: 'arrow-down',
    statusText: 'Received',
    address: merchantSafe?.id || '',
    fromAddress: prepaidCard.id,
    nativeBalanceDisplay,
    timestamp: Number(timestamp) + 1,
    spendAmount,
    transactionHash: transactionDetails.id,
    token,
    transaction: earnedTransactionDetails,
  };
};
