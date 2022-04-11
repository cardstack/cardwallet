import React from 'react';

import {
  TransactionBase,
  TransactionBaseCustomizationProps,
} from '../TransactionBase';
import { PrepaidCardTransactionHeader } from './PrepaidCardTransactionHeader';
import { Icon } from '@cardstack/components';
import { PrepaidCardTransferTransactionType } from '@cardstack/types';

interface PrepaidCardTransferTransactionProps
  extends TransactionBaseCustomizationProps {
  item: PrepaidCardTransferTransactionType;
}

export const PrepaidCardTransferTransaction = ({
  item,
  ...props
}: PrepaidCardTransferTransactionProps) => {
  const statusIconName =
    item.statusText === 'Transferred' ? 'arrow-up' : 'arrow-down';

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
      statusIconName={statusIconName}
      statusText={item.statusText}
      topText="Face value"
      primaryText={item.nativeBalanceDisplay}
      transactionHash={item.transactionHash}
    />
  );
};
