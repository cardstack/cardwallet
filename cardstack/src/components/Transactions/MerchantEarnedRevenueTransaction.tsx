import React from 'react';

import {
  TransactionBase,
  TransactionBaseCustomizationProps,
} from './TransactionBase';
import { CoinIcon, SafeHeader } from '@cardstack/components';
import { MerchantEarnedRevenueTransactionType } from '@cardstack/types';

export interface MerchantEarnRevenueTransactionProps
  extends TransactionBaseCustomizationProps {
  item: MerchantEarnedRevenueTransactionType;
}

export const MerchantEarnedRevenueTransaction = ({
  item,
  ...props
}: MerchantEarnRevenueTransactionProps) => {
  return (
    <TransactionBase
      {...props}
      CoinIcon={
        <CoinIcon address={item.token.address} symbol={item.token.symbol} />
      }
      Header={
        <SafeHeader address={item.address} rightText="MERCHANT NAME" small />
      }
      primaryText={`+ ${item.balance.display}`}
      statusIconName="arrow-down"
      statusText="Earned"
      subText={item.native.display}
      transactionHash={item.transactionHash}
    />
  );
};
