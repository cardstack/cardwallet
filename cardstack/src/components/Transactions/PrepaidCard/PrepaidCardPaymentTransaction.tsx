import React, { useCallback } from 'react';

import { useNavigation } from '@react-navigation/core';
import {
  TransactionBase,
  TransactionBaseCustomizationProps,
  TransactionBaseProps,
} from '../TransactionBase';
import { PrepaidCardTransactionHeader } from './PrepaidCardTransactionHeader';
import { Icon } from '@cardstack/components';
import { PrepaidCardPaymentTransactionType } from '@cardstack/types';
import Routes from '@rainbow-me/routes';

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
    (assetProps: TransactionBaseProps) =>
      navigate(Routes.EXPANDED_ASSET_SHEET, {
        asset: { ...assetProps },
        type: 'paymentConfirmationTransaction',
      }),
    [navigate]
  );

  return (
    <TransactionBase
      {...props}
      CoinIcon={<Icon name="spend" />}
      Header={
        <PrepaidCardTransactionHeader
          address={item.address}
          cardCustomization={item.cardCustomization}
        />
      }
      statusIconName="arrow-up"
      statusText="Paid"
      primaryText={`- ${item.spendBalanceDisplay}`}
      subText={item.nativeBalanceDisplay}
      transactionHash={item.transactionHash}
      onPressTransaction={onPressTransaction}
    />
  );
};
