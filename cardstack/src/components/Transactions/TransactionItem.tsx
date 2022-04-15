import React, { memo } from 'react';

import { TransactionType, TransactionTypes } from '@cardstack/types';

import { DepotBridgedLayer1Transaction } from './DepotBridgedLayer1Transaction';
import { DepotBridgedLayer2Transaction } from './DepotBridgedLayer2Transaction';
import { ERC20Transaction } from './ERC20Transaction';
import { MerchantClaimTransaction } from './Merchant/MerchantClaimTransaction';
import { MerchantCreationTransaction } from './Merchant/MerchantCreationTransaction';
import { MerchantDepositTransaction } from './Merchant/MerchantDepositTransaction';
import { MerchantEarnedRevenueTransaction } from './Merchant/MerchantEarnedRevenueTransaction';
import { MerchantEarnedSpendAndRevenueTransaction } from './Merchant/MerchantEarnedSpendAndRevenueTransaction';
import { MerchantEarnedSpendTransaction } from './Merchant/MerchantEarnedSpendTransaction';
import { MerchantPrepaidCardIssuanceTransaction } from './Merchant/MerchantPrepaidCardIssuanceTransaction';
import { MerchantWithdrawTransaction } from './Merchant/MerchantWithdrawTransaction';
import { PrepaidCardCreatedTransaction } from './PrepaidCard/PrepaidCardCreatedTransaction';
import { PrepaidCardPaymentTransaction } from './PrepaidCard/PrepaidCardPaymentTransaction';
import { PrepaidCardSplitTransaction } from './PrepaidCard/PrepaidCardSplitTransaction';
import { PrepaidCardTransferTransaction } from './PrepaidCard/PrepaidCardTransferTransaction';
import { TransactionBaseCustomizationProps } from './TransactionBase';

export interface TransactionItemProps
  extends TransactionBaseCustomizationProps {
  item: TransactionType;
  isFullWidth?: boolean;
}

type TxTypesWithoutReneveueEvent = Exclude<
  TransactionTypes,
  TransactionTypes.MERCHANT_REVENUE_EVENT
>;

const transactionItemMap: Record<
  TxTypesWithoutReneveueEvent,
  React.ElementType // TODO - figure how to pass props type as generic
> = {
  [TransactionTypes.DEPOT_BRIDGED_LAYER_1]: DepotBridgedLayer1Transaction,
  [TransactionTypes.DEPOT_BRIDGED_LAYER_2]: DepotBridgedLayer2Transaction,
  [TransactionTypes.PREPAID_CARD_CREATED]: PrepaidCardCreatedTransaction,
  [TransactionTypes.PREPAID_CARD_PAYMENT]: PrepaidCardPaymentTransaction,
  [TransactionTypes.PREPAID_CARD_SPLIT]: PrepaidCardSplitTransaction,
  [TransactionTypes.PREPAID_CARD_TRANSFER]: PrepaidCardTransferTransaction,
  [TransactionTypes.MERCHANT_CREATION]: MerchantCreationTransaction,
  [TransactionTypes.MERCHANT_CLAIM]: MerchantClaimTransaction,
  [TransactionTypes.MERCHANT_WITHDRAW]: MerchantWithdrawTransaction,
  [TransactionTypes.MERCHANT_DEPOSIT]: MerchantDepositTransaction,
  [TransactionTypes.MERCHANT_EARNED_REVENUE]: MerchantEarnedRevenueTransaction,
  [TransactionTypes.MERCHANT_EARNED_SPEND]: MerchantEarnedSpendTransaction,
  [TransactionTypes.MERCHANT_EARNED_SPEND_AND_REVENUE]: MerchantEarnedSpendAndRevenueTransaction,
  [TransactionTypes.MERCHANT_PREPAIDCARD_ISSUANCE]: MerchantPrepaidCardIssuanceTransaction,
  [TransactionTypes.ERC_20]: ERC20Transaction,
};

export const TransactionItem = memo((props: TransactionItemProps) => {
  const { item } = props;

  if (!item) {
    return null;
  }

  const Transaction =
    transactionItemMap[item.type as TxTypesWithoutReneveueEvent] || null;

  return <Transaction {...props} item={item} />;
});
