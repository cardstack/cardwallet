import React from 'react';
import { TransactionBase } from './TransactionBase';
import { Icon, SafeHeader } from '@cardstack/components';
import { MerchantCreationTransactionType } from '@cardstack/types';

export const MerchantCreationTransaction = ({
  item,
}: {
  item: MerchantCreationTransactionType;
}) => {
  return (
    <TransactionBase
      CoinIcon={<Icon name="user" />}
      Header={
        <SafeHeader address={item.address} rightText="MERCHANT NAME" small />
      }
      statusIconName="plus"
      statusText="Created"
      primaryText="Mandello"
      subText="Merchant Account"
      transactionHash={item.transactionHash}
    />
  );
};
