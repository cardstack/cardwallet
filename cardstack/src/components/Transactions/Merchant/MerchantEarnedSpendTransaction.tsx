import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';

import { Routes } from '@cardstack/navigation';
import { MerchantEarnedSpendTransactionType } from '@cardstack/types';

import { Icon } from '../../Icon';
import {
  TransactionBase,
  TransactionBaseCustomizationProps,
  TransactionBaseProps,
} from '../TransactionBase';

export interface MerchantEarnSpendTransactionProps
  extends TransactionBaseCustomizationProps {
  item: MerchantEarnedSpendTransactionType;
}

export const MerchantEarnedSpendTransaction = ({
  item,
  ...props
}: MerchantEarnSpendTransactionProps) => {
  const { navigate } = useNavigation();

  const onPressTransaction = useCallback(
    (transaction: TransactionBaseProps) =>
      navigate(Routes.PAYMENT_RECEIVED_SHEET, {
        transaction: { ...transaction, ...item },
      }),
    [item, navigate]
  );

  return (
    <TransactionBase
      {...props}
      CoinIcon={<Icon name="spend" />}
      primaryText={`+ ${item.nativeBalanceDisplay}`}
      statusIconName="arrow-down"
      statusText="Earned"
      transactionHash={item.transactionHash}
      onPressTransaction={onPressTransaction}
    />
  );
};
