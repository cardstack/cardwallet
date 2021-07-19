import React from 'react';

import { TransactionBase } from './TransactionBase';
import { PrepaidCardTransactionHeader } from './PrepaidCardTransactionHeader';
import { Icon } from '@cardstack/components';
import { PrepaidCardPaymentTransactionType } from '@cardstack/types';

export const PrepaidCardPaymentTransaction = ({
  item,
}: {
  item: PrepaidCardPaymentTransactionType;
}) => {
  return (
    <TransactionBase
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
