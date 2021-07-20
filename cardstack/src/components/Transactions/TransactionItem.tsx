import React from 'react';
import { ERC20Transaction } from './ERC20Transaction';
import { DepotBridgedLayer2Transaction } from './DepotBridgedLayer2Transaction';
import { MerchantCreationTransaction } from './MerchantCreationTransaction';
import { PrepaidCardCreatedTransaction } from './PrepaidCardCreatedTransaction';
import { PrepaidCardPaymentTransaction } from './PrepaidCardPaymentTransaction';
import { PrepaidCardSplitTransaction } from './PrepaidCardSplitTransaction';
import { PrepaidCardTransferTransaction } from './PrepaidCardTransferTransaction';
import { DepotBridgedLayer1Transaction } from './DepotBridgedLayer1Transaction';
import { TransactionType, TransactionTypes } from '@cardstack/types';
interface TransactionItemProps {
  item: TransactionType;
}

export const TransactionItem = (props: TransactionItemProps) => {
  const { item } = props;

  if (!item) {
    return null;
  }

  if (item.type === TransactionTypes.DEPOT_BRIDGED_LAYER_1) {
    return <DepotBridgedLayer1Transaction item={item} />;
  } else if (item.type === TransactionTypes.DEPOT_BRIDGED_LAYER_2) {
    return <DepotBridgedLayer2Transaction item={item} />;
  } else if (item.type === TransactionTypes.PREPAID_CARD_CREATED) {
    return <PrepaidCardCreatedTransaction item={item} />;
  } else if (item.type === TransactionTypes.PREPAID_CARD_PAYMENT) {
    return <PrepaidCardPaymentTransaction item={item} />;
  } else if (item.type === TransactionTypes.PREPAID_CARD_SPLIT) {
    return <PrepaidCardSplitTransaction item={item} />;
  } else if (item.type === TransactionTypes.PREPAID_CARD_TRANSFER) {
    return <PrepaidCardTransferTransaction item={item} />;
  } else if (item.type === TransactionTypes.MERCHANT_CREATION) {
    return <MerchantCreationTransaction item={item} />;
  } else if (item.type === TransactionTypes.ERC_20) {
    return <ERC20Transaction item={item} />;
  }

  return null;
};
