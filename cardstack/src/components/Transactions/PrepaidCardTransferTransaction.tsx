import React from 'react';

import { PrepaidCardTransaction } from './PrepaidCardTransaction';
import { PrepaidCardTransferTransactionType } from '@cardstack/types';

export const PrepaidCardTransferTransaction = ({
  item,
}: {
  item: PrepaidCardTransferTransactionType;
}) => {
  return (
    <PrepaidCardTransaction
      {...item}
      iconName="arrow-up"
      status="Transferred"
      topText="Face value"
      primaryText={item.spendBalanceDisplay}
      subText={item.nativeBalanceDisplay}
    />
  );
};
