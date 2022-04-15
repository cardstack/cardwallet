import React from 'react';

import { CoinIcon } from '@cardstack/components';
import { useMerchantInfoFromDID } from '@cardstack/hooks/merchant/useMerchantInfoFromDID';
import { useNameOrPreviewFromAddress } from '@cardstack/hooks/merchant/useNameOrPreviewFromAddress';
import { MerchantWithdrawType } from '@cardstack/types';

import { SafeHeader } from '../../SafeHeader';
import {
  TransactionBase,
  TransactionBaseCustomizationProps,
} from '../TransactionBase';

export interface MerchantWithdrawTransactionProps
  extends TransactionBaseCustomizationProps {
  item: MerchantWithdrawType;
}

export const MerchantWithdrawTransaction = ({
  item,
  ...props
}: MerchantWithdrawTransactionProps) => {
  const { merchantInfoDID } = useMerchantInfoFromDID(item.infoDid);
  const { name: nameForAddress } = useNameOrPreviewFromAddress(item.to);

  return (
    <TransactionBase
      {...props}
      CoinIcon={<CoinIcon address={item.token.id} symbol={item.token.symbol} />}
      Header={
        !item.hideSafeHeader ? (
          <SafeHeader
            address={item.address}
            backgroundColor={merchantInfoDID?.color}
            textColor={merchantInfoDID?.textColor}
            rightText={merchantInfoDID?.name || 'Business'}
            small
          />
        ) : null
      }
      primaryText={`${item.balance.display}`}
      statusIconName="arrow-up"
      statusText="Withdrawn"
      subText={item.native.display}
      transactionHash={item.transactionHash}
      recipientName={nameForAddress}
    />
  );
};
