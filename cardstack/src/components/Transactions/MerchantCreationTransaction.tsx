import React from 'react';
import {
  TransactionBase,
  TransactionBaseCustomizationProps,
} from './TransactionBase';
import { Icon, SafeHeader } from '@cardstack/components';
import { MerchantCreationTransactionType } from '@cardstack/types';

interface MerchantCreationTransactionProps
  extends TransactionBaseCustomizationProps {
  item: MerchantCreationTransactionType;
}

export const MerchantCreationTransaction = ({
  item,
  ...props
}: MerchantCreationTransactionProps) => {
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
