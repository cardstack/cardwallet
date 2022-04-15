import { useNavigation } from '@react-navigation/core';
import React, { useCallback } from 'react';

import { Icon } from '@cardstack/components';
import { PrepaidCardPaymentTransactionType } from '@cardstack/types';

import Routes from '@rainbow-me/routes';

import {
  TransactionBase,
  TransactionBaseCustomizationProps,
} from '../TransactionBase';

import { PrepaidCardTransactionHeader } from './PrepaidCardTransactionHeader';

interface PrepaidCardPaymentTransactionProps
  extends TransactionBaseCustomizationProps {
  item: PrepaidCardPaymentTransactionType;
}

export const PrepaidCardPaymentTransaction = ({
  item,
  ...props
}: PrepaidCardPaymentTransactionProps) => {
  const { navigate } = useNavigation();

  const onPressTransaction = useCallback(
    () =>
      navigate(Routes.PAYMENT_CONFIRMATION_SHEET, {
        ...item,
      }),
    [item, navigate]
  );

  return (
    <TransactionBase
      {...props}
      CoinIcon={<Icon name="spend" />}
      Header={
        <PrepaidCardTransactionHeader
          address={item.address}
          cardCustomization={item.cardCustomization}
          prepaidInlineTransaction={props.prepaidInlineTransaction}
          merchantName={item.merchantInfo?.name}
        />
      }
      statusIconName="arrow-up"
      statusText="Paid"
      primaryText={`- ${item.nativeBalanceDisplay}`}
      transactionHash={item.transactionHash}
      onPressTransaction={onPressTransaction}
    />
  );
};
