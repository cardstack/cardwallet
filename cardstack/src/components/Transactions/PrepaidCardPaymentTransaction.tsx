import React from 'react';

import { PrepaidCardTransaction } from './PrepaidCardTransaction';
import { PrepaidCardPaymentTransactionType } from '@cardstack/types';

export const PrepaidCardPaymentTransaction = ({
  item,
}: {
  item: PrepaidCardPaymentTransactionType;
}) => {
  return (
    <PrepaidCardTransaction
      {...item}
      iconName="arrow-up"
      status="Paid"
      operator="-"
      primaryText={item.spendBalanceDisplay}
      subText={item.nativeBalanceDisplay}
    />
  );
};
