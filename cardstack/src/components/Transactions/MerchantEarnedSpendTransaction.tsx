import React from 'react';

import { Icon } from '../Icon';
import {
  TransactionBase,
  TransactionBaseCustomizationProps,
} from './TransactionBase';
import { MerchantEarnedSpendTransactionType } from '@cardstack/types';
import { SafeHeader } from '@cardstack/components';

export interface MerchantEarnSpendTransactionProps
  extends TransactionBaseCustomizationProps {
  item: MerchantEarnedSpendTransactionType;
}

export const MerchantEarnedSpendTransaction = ({
  item,
  ...props
}: MerchantEarnSpendTransactionProps) => {
  return (
    <TransactionBase
      {...props}
      CoinIcon={<Icon name="spend" />}
      Header={
        <SafeHeader address={item.address} rightText="MERCHANT NAME" small />
      }
      primaryText={`+ ${item.spendBalanceDisplay}`}
      statusIconName="arrow-down"
      statusText="Earned"
      subText={item.nativeBalanceDisplay}
      transactionHash={item.transactionHash}
    />
  );
};
