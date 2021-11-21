import React from 'react';
import { SafeHeader } from '../../SafeHeader';
import {
  TransactionBase,
  TransactionBaseCustomizationProps,
} from '../TransactionBase';
import { MerchantWithdrawType } from '@cardstack/types';
import { getAddressPreview } from '@cardstack/utils';
import { CoinIcon } from '@cardstack/components';
import { useAccountProfile } from '@rainbow-me/hooks';
import { useMerchantInfoFromDID } from '@cardstack/hooks/merchant/useMerchantInfoFromDID';

export interface MerchantWithdrawTransactionProps
  extends TransactionBaseCustomizationProps {
  item: MerchantWithdrawType;
}

export const MerchantWithdrawTransaction = ({
  item,
  ...props
}: MerchantWithdrawTransactionProps) => {
  const { merchantInfoDID } = useMerchantInfoFromDID(item.infoDid);

  const { accountName } = useAccountProfile();

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
      statusText={`Withdrawn from \nAccount`}
      subText={item.native.display}
      transactionHash={item.transactionHash}
      recipientName={accountName || getAddressPreview(item.to)}
    />
  );
};
