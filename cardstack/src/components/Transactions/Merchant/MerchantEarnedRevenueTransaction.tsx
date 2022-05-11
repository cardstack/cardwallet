import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';

import { CoinIcon } from '@cardstack/components';
import { Routes } from '@cardstack/navigation';
import { MerchantEarnedRevenueTransactionType } from '@cardstack/types';

import {
  TransactionBase,
  TransactionBaseCustomizationProps,
  TransactionBaseProps,
} from '../TransactionBase';

export interface MerchantEarnRevenueTransactionProps
  extends TransactionBaseCustomizationProps {
  item: MerchantEarnedRevenueTransactionType;
}

export const MerchantEarnedRevenueTransaction = ({
  item,
  ...props
}: MerchantEarnRevenueTransactionProps) => {
  const { navigate } = useNavigation();

  const onPressTransaction = useCallback(
    (itemProps: TransactionBaseProps) =>
      navigate(Routes.MERCHANT_TRANSACTION_SHEET, {
        item: { ...item, ...itemProps },
      }),
    [item, navigate]
  );

  return (
    <TransactionBase
      {...props}
      CoinIcon={
        <CoinIcon address={item.token.address} symbol={item.token.symbol} />
      }
      primaryText={`+ ${item.netEarned.display}`}
      statusIconName="plus"
      statusText="Received"
      subText={item.netEarnedNativeDisplay}
      transactionHash={item.transactionHash}
      onPressTransaction={onPressTransaction}
    />
  );
};
