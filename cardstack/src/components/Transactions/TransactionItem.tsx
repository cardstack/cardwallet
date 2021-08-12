import React from 'react';
import { ERC20Transaction } from './ERC20Transaction';
import { DepotBridgedLayer2Transaction } from './DepotBridgedLayer2Transaction';
import { MerchantCreationTransaction } from './MerchantCreationTransaction';
import { MerchantClaimTransaction } from './MerchantClaimTransaction';
import { PrepaidCardCreatedTransaction } from './PrepaidCardCreatedTransaction';
import { PrepaidCardPaymentTransaction } from './PrepaidCardPaymentTransaction';
import { PrepaidCardSplitTransaction } from './PrepaidCardSplitTransaction';
import { PrepaidCardTransferTransaction } from './PrepaidCardTransferTransaction';
import { DepotBridgedLayer1Transaction } from './DepotBridgedLayer1Transaction';
import { TransactionBaseCustomizationProps } from './TransactionBase';
import { TransactionType, TransactionTypes } from '@cardstack/types';
interface TransactionItemProps extends TransactionBaseCustomizationProps {
  item: TransactionType;
  isFullWidth?: boolean;
}

export const TransactionItem = (props: TransactionItemProps) => {
  const { item } = props;

  if (!item) {
    return null;
  }

  if (item.type === TransactionTypes.DEPOT_BRIDGED_LAYER_1) {
    return <DepotBridgedLayer1Transaction {...props} item={item} />;
  } else if (item.type === TransactionTypes.DEPOT_BRIDGED_LAYER_2) {
    return <DepotBridgedLayer2Transaction {...props} item={item} />;
  } else if (item.type === TransactionTypes.PREPAID_CARD_CREATED) {
    return <PrepaidCardCreatedTransaction {...props} item={item} />;
  } else if (item.type === TransactionTypes.PREPAID_CARD_PAYMENT) {
    return <PrepaidCardPaymentTransaction {...props} item={item} />;
  } else if (item.type === TransactionTypes.PREPAID_CARD_SPLIT) {
    return <PrepaidCardSplitTransaction {...props} item={item} />;
  } else if (item.type === TransactionTypes.PREPAID_CARD_TRANSFER) {
    return <PrepaidCardTransferTransaction {...props} item={item} />;
  } else if (item.type === TransactionTypes.MERCHANT_CREATION) {
    return <MerchantCreationTransaction {...props} item={item} />;
  } else if (item.type === TransactionTypes.MERCHANT_CLAIM) {
    return <MerchantClaimTransaction {...props} item={item} />;
  } else if (item.type === TransactionTypes.ERC_20) {
    return <ERC20Transaction {...props} item={item} />;
  }

  return null;
};
