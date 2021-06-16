import React from 'react';
import { TransactionCoinRow } from './TransactionCoinRow';
import { BridgedTokenTransaction } from './BridgedTokenTransaction';
import { TransactionType } from '@cardstack/types';

interface TransactionItemProps {
  item: any;
}

export const TransactionItem = (props: TransactionItemProps) => {
  const { item } = props;

  if (item.type === TransactionType.BRIDGED) {
    return <BridgedTokenTransaction {...props} />;
  }

  return <TransactionCoinRow {...props} />;
};
