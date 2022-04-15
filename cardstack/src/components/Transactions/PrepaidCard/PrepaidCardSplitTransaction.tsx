import React from 'react';

import { Icon } from '@cardstack/components';
import { PrepaidCardSplitTransactionType } from '@cardstack/types';

import {
  TransactionBase,
  TransactionBaseCustomizationProps,
} from '../TransactionBase';

import { PrepaidCardTransactionHeader } from './PrepaidCardTransactionHeader';

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
      primaryText={item.nativeBalanceDisplay}
      topText={`${item.prepaidCardCount} prepaid cards of`}
      transactionHash={item.transactionHash}
    />
  );
};
