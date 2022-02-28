import React, { useCallback } from 'react';

import { useNavigation } from '@react-navigation/core';
import {
  TransactionBase,
  TransactionBaseCustomizationProps,
  TransactionBaseProps,
} from '../TransactionBase';
import { CoinIcon } from '@cardstack/components';
import { MerchantEarnedRevenueTransactionType } from '@cardstack/types';
import Routes from '@rainbow-me/routes';

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
      statusText="Earned"
      subText={item.netEarnedNativeDisplay}
      transactionHash={item.transactionHash}
      onPressTransaction={onPressTransaction}
    />
  );
};
