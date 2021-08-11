import React from 'react';
import {
  TransactionBase,
  TransactionBaseCustomizationProps,
} from './TransactionBase';
import { Icon, SafeHeader } from '@cardstack/components';
import { MerchantRevenueEventType } from '@cardstack/types';

interface MerchantRevenueEventTransactionProps
  extends TransactionBaseCustomizationProps {
  item: MerchantRevenueEventType;
}

export const MerchantRevenueEventTransaction = ({
  item,
  ...props
}: MerchantRevenueEventTransactionProps) => {
  return (
    <TransactionBase
      {...props}
      CoinIcon={<Icon name="user" />}
      Header={
        <SafeHeader address={item.address} rightText="MERCHANT NAME" small />
      }
      statusIconName="plus"
      statusText="Created"
      primaryText="Merchant Name"
      subText="Merchant Account"
      transactionHash={item.transactionHash}
    />
  );
};
