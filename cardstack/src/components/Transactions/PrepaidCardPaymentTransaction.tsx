import React from 'react';

import {
  TransactionBase,
  TransactionBaseCustomizationProps,
} from './TransactionBase';
import { PrepaidCardTransactionHeader } from './PrepaidCardTransactionHeader';
import { Icon } from '@cardstack/components';
import { PrepaidCardPaymentTransactionType } from '@cardstack/types';

interface PrepaidCardPaymentTransactionProps
  extends TransactionBaseCustomizationProps {
  item: PrepaidCardPaymentTransactionType;
}

export const PrepaidCardPaymentTransaction = ({
  item,
  ...props
}: PrepaidCardPaymentTransactionProps) => {
  return (
    <TransactionBase
      {...props}
      CoinIcon={<Icon name="spend" />}
      Header={<PrepaidCardTransactionHeader address={item.address} />}
      statusIconName="arrow-up"
      statusText="Paid"
      primaryText={`- ${item.spendBalanceDisplay}`}
      subText={item.nativeBalanceDisplay}
      transactionHash={item.transactionHash}
    />
  );
};
