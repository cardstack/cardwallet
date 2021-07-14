import React from 'react';
import { TransactionCoinRow } from './TransactionCoinRow';
import { BridgedTokenTransaction } from './BridgedTokenTransaction';
import { MerchantCreationTransaction } from './MerchantCreationTransaction';
import { PrepaidCardTransaction } from './PrepaidCardTransaction';
import { TransactionTypes } from '@cardstack/types';
interface TransactionItemProps {
  item: any;
}

export const TransactionItem = (props: TransactionItemProps) => {
  const { item } = props;

  if (item.type === TransactionTypes.BRIDGED) {
    return <BridgedTokenTransaction {...props} />;
  } else if (
    item.type === TransactionTypes.PREPAID_CARD_CREATED ||
    item.type === TransactionTypes.PREPAID_CARD_PAYMENT
  ) {
    return <PrepaidCardTransaction {...props} />;
  } else if (item.type === TransactionTypes.MERCHANT_CREATION) {
    return <MerchantCreationTransaction {...props} />;
  } else if (item.type && item.type !== TransactionTypes.ERC_20) {
    return null;
  }

  return <TransactionCoinRow {...props} />;
};
