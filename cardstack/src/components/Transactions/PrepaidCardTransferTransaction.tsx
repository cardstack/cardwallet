import React from 'react';

import { TransactionBase } from './TransactionBase';
import { PrepaidCardTransactionHeader } from './PrepaidCardTransactionHeader';
import { Icon } from '@cardstack/components';
import { PrepaidCardTransferTransactionType } from '@cardstack/types';

export const PrepaidCardTransferTransaction = ({
  item,
}: {
  item: PrepaidCardTransferTransactionType;
}) => {
  return (
    <TransactionBase
      CoinIcon={<Icon name="spend" />}
      Header={<PrepaidCardTransactionHeader address={item.address} />}
      statusIconName="arrow-up"
      statusText="Transferred"
      topText="Face value"
      primaryText={item.spendBalanceDisplay}
      subText={item.nativeBalanceDisplay}
      transactionHash={item.transactionHash}
    />
  );
};
