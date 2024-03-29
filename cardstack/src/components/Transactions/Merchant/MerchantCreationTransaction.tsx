import React from 'react';

import { Icon, SafeHeader } from '@cardstack/components';
import { useMerchantInfoFromDID } from '@cardstack/hooks/merchant/useMerchantInfoFromDID';
import { MerchantCreationTransactionType } from '@cardstack/types';

import {
  TransactionBase,
  TransactionBaseCustomizationProps,
} from '../TransactionBase';

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
      CoinIcon={<Icon name="user-with-background" />}
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
      transactionHash={item.transactionHash}
    />
  );
};
