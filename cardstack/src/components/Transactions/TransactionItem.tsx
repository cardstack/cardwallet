import React from 'react';

import { DepotBridgedLayer1Transaction } from './DepotBridgedLayer1Transaction';
import { DepotBridgedLayer2Transaction } from './DepotBridgedLayer2Transaction';
import { ERC20Transaction } from './ERC20Transaction';
import { MerchantClaimTransaction } from './Merchant/MerchantClaimTransaction';
import { MerchantCreationTransaction } from './Merchant/MerchantCreationTransaction';
import { MerchantEarnedRevenueTransaction } from './Merchant/MerchantEarnedRevenueTransaction';
import { PrepaidCardCreatedTransaction } from './PrepaidCardCreatedTransaction';
import { PrepaidCardPaymentTransaction } from './PrepaidCardPaymentTransaction';
import { PrepaidCardSplitTransaction } from './PrepaidCardSplitTransaction';
import { PrepaidCardTransferTransaction } from './PrepaidCardTransferTransaction';
import { TransactionBaseCustomizationProps } from './TransactionBase';
import { MerchantEarnedSpendTransaction } from './Merchant/MerchantEarnedSpendTransaction';
import { MerchantEarnedSpendAndRevenueTransaction } from './Merchant/MerchantEarnedSpendAndRevenueTransaction';
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

  switch (item.type) {
    case TransactionTypes.DEPOT_BRIDGED_LAYER_1:
      return <DepotBridgedLayer1Transaction {...props} item={item} />;
    case TransactionTypes.DEPOT_BRIDGED_LAYER_2:
      return <DepotBridgedLayer2Transaction {...props} item={item} />;
    case TransactionTypes.PREPAID_CARD_CREATED:
      return <PrepaidCardCreatedTransaction {...props} item={item} />;
    case TransactionTypes.PREPAID_CARD_PAYMENT:
      return <PrepaidCardPaymentTransaction {...props} item={item} />;
    case TransactionTypes.PREPAID_CARD_SPLIT:
      return <PrepaidCardSplitTransaction {...props} item={item} />;
    case TransactionTypes.PREPAID_CARD_TRANSFER:
      return <PrepaidCardTransferTransaction {...props} item={item} />;
    case TransactionTypes.MERCHANT_CREATION:
      return <MerchantCreationTransaction {...props} item={item} />;
    case TransactionTypes.MERCHANT_CLAIM:
      return <MerchantClaimTransaction {...props} item={item} />;
    case TransactionTypes.MERCHANT_EARNED_REVENUE:
      return <MerchantEarnedRevenueTransaction {...props} item={item} />;
    case TransactionTypes.MERCHANT_EARNED_SPEND:
      return <MerchantEarnedSpendTransaction {...props} item={item} />;
    case TransactionTypes.MERCHANT_EARNED_SPEND_AND_REVENUE:
      return (
        <MerchantEarnedSpendAndRevenueTransaction {...props} item={item} />
      );
    case TransactionTypes.ERC_20:
      return <ERC20Transaction {...props} item={item} />;
    default:
      return null;
  }
};
