import React from 'react';

import { PrepaidCardTransaction } from './PrepaidCardTransaction';
import { PrepaidCardSplitTransactionType } from '@cardstack/types';

export const PrepaidCardSplitTransaction = ({
  item,
}: {
  item: PrepaidCardSplitTransactionType;
}) => {
  return (
    <PrepaidCardTransaction
      {...item}
      iconName="split"
      status="Split"
      primaryText={item.spendBalanceDisplay}
      topText={`${item.prepaidCardCount} prepaid cards of`}
    />
  );
};
