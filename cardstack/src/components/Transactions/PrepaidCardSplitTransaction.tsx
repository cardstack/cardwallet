import React from 'react';

import { PrepaidCardTransactionHeader } from './PrepaidCardTransactionHeader';
import { TransactionBase } from './TransactionBase';
import { Icon } from '@cardstack/components';
import { PrepaidCardSplitTransactionType } from '@cardstack/types';

export const PrepaidCardSplitTransaction = ({
  item,
}: {
  item: PrepaidCardSplitTransactionType;
}) => {
  return (
    <TransactionBase
      CoinIcon={<Icon name="spend" />}
      Header={<PrepaidCardTransactionHeader address={item.address} />}
      statusIconName="split"
      statusText="Split"
      primaryText={item.spendBalanceDisplay}
      topText={`${item.prepaidCardCount} prepaid cards of`}
      transactionHash={item.transactionHash}
    />
  );
};
