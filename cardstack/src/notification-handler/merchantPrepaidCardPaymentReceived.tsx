import React from 'react';
import { InteractionManager } from 'react-native';

import { SafeHeader } from '@cardstack/components';
import { PrepaidCardPayment } from '@cardstack/graphql';
import { Routes } from '@cardstack/navigation';
import {
  convertSpendForBalanceDisplay,
  getMerchantEarnedTransactionDetails,
} from '@cardstack/utils';
import { fetchMerchantInfoFromDID } from '@cardstack/utils/merchant-utils';

import { Navigation } from '@rainbow-me/navigation';
import store from '@rainbow-me/redux/store';
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
      Navigation.handleAction(Routes.PAYMENT_RECEIVED_SHEET, {
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
    timestamp,
    prepaidCard,
  } = transactionDetails;

  const merchantInfoDID = await fetchMerchantInfoFromDID(
    merchantSafe?.infoDid || undefined
  );

  const { nativeCurrency } = store.getState().settings;

  const symbol = issuingToken.symbol || '';

  const { nativeBalanceDisplay } = await convertSpendForBalanceDisplay(
    spendAmount,
    nativeCurrency
  );

  const earnedTransactionDetails = await getMerchantEarnedTransactionDetails(
    transactionDetails,
    nativeCurrency,
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
