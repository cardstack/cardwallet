import React from 'react';
import { TransactionCoinRow } from './TransactionCoinRow';
import { BridgedTokenTransaction } from './BridgedTokenTransaction';
import { CreatedPrepaidCardTransaction } from './CreatedPrepaidCardTransaction';
import { TransactionType } from '@cardstack/types';

interface TransactionItemProps {
  item: any;
}

export const TransactionItem = (props: TransactionItemProps) => {
  const { item } = props;

  if (item.type === TransactionType.BRIDGED) {
    return <BridgedTokenTransaction {...props} />;
  } else if (item.type === TransactionType.CREATED_PREPAID_CARD) {
    return <CreatedPrepaidCardTransaction {...props} />;
  }

  return <TransactionCoinRow {...props} />;
};
