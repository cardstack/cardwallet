import React from 'react';

import { PrepaidCardTransactionHeader } from './PrepaidCardTransactionHeader';
import {
  TransactionBase,
  TransactionBaseCustomizationProps,
} from '../TransactionBase';
import { Icon } from '@cardstack/components';
import { PrepaidCardSplitTransactionType } from '@cardstack/types';

interface PrepaidCardSplitTransactionProps
  extends TransactionBaseCustomizationProps {
  item: PrepaidCardSplitTransactionType;
}

export const PrepaidCardSplitTransaction = ({
  item,
  ...props
}: PrepaidCardSplitTransactionProps) => {
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
      statusIconName="split"
      statusText="Split"
      primaryText={item.spendBalanceDisplay}
      topText={`${item.prepaidCardCount} prepaid cards of`}
      transactionHash={item.transactionHash}
    />
  );
};
