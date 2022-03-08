import React from 'react';
import { SafeHeader } from '../../SafeHeader';
import {
  TransactionBase,
  TransactionBaseCustomizationProps,
} from '../TransactionBase';
import { MerchantDepositType } from '@cardstack/types';
import { CoinIcon } from '@cardstack/components';
import { useMerchantInfoFromDID } from '@cardstack/hooks/merchant/useMerchantInfoFromDID';

export interface MerchantPrepaidCardIssuanceTransactionProps
  extends TransactionBaseCustomizationProps {
  item: MerchantDepositType;
}

export const MerchantPrepaidCardIssuanceTransaction = ({
  item,
  ...props
}: MerchantPrepaidCardIssuanceTransactionProps) => {
  const { merchantInfoDID } = useMerchantInfoFromDID(item.infoDid);

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
    />
  );
};
