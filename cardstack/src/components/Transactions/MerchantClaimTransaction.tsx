import React from 'react';

import { SafeHeader } from '../SafeHeader';
import {
  TransactionBase,
  TransactionBaseCustomizationProps,
} from './TransactionBase';
import { MerchantClaimType } from '@cardstack/types';
import { CoinIcon } from '@cardstack/components';

export interface MerchantClaimTransactionProps
  extends TransactionBaseCustomizationProps {
  item: MerchantClaimType;
}

export const MerchantClaimTransaction = ({
  item,
  ...props
}: MerchantClaimTransactionProps) => {
  return (
    <TransactionBase
      {...props}
      CoinIcon={
        <CoinIcon address={item.token.address} symbol={item.token.symbol} />
      }
      Header={
        !item.hideSafeHeader ? (
          <SafeHeader address={item.address} rightText="MERCHANT NAME" small />
        ) : null
      }
      primaryText={`- ${item.balance.display}`}
      statusIconName="arrow-up"
      statusText="Claimed"
      subText={item.native.display}
      transactionHash={item.transactionHash}
    />
  );
};
