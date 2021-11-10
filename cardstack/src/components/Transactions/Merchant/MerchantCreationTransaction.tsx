import React from 'react';
import {
  TransactionBase,
  TransactionBaseCustomizationProps,
} from '../TransactionBase';
import { Icon, SafeHeader } from '@cardstack/components';
import { MerchantCreationTransactionType } from '@cardstack/types';
import { useMerchantInfoFromDID } from '@cardstack/hooks/merchant/useMerchantInfoFromDID';

interface MerchantCreationTransactionProps
  extends TransactionBaseCustomizationProps {
  item: MerchantCreationTransactionType;
}

export const MerchantCreationTransaction = ({
  item,
  ...props
}: MerchantCreationTransactionProps) => {
  const { merchantInfoDID } = useMerchantInfoFromDID(item.infoDid);

  return (
    <TransactionBase
      {...props}
      CoinIcon={<Icon name="user" />}
      Header={
        <SafeHeader
          address={item.address}
          backgroundColor={merchantInfoDID?.color}
          textColor={merchantInfoDID?.textColor}
          rightText={merchantInfoDID?.name || 'Business'}
          small
        />
      }
      statusIconName="plus"
      statusText="Created"
      primaryText={merchantInfoDID?.name || 'Business'}
      subText="Business Account"
      transactionHash={item.transactionHash}
    />
  );
};
