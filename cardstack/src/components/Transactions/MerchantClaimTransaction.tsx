import React from 'react';

import { useNavigation } from '@react-navigation/core';
import { SafeHeader } from '../SafeHeader';
import {
  TransactionBase,
  TransactionBaseCustomizationProps,
} from './TransactionBase';
import { MerchantClaimType } from '@cardstack/types';
import { CoinIcon } from '@cardstack/components';
import Routes from '@rainbow-me/routes';

export interface MerchantClaimTransactionProps
  extends TransactionBaseCustomizationProps {
  item: MerchantClaimType;
}

export const MerchantClaimTransaction = ({
  item,
  ...props
}: MerchantClaimTransactionProps) => {
  const { navigate } = useNavigation();

  const onPressTransaction = (assetProps: any) =>
    navigate(Routes.EXPANDED_ASSET_SHEET, {
      asset: { ...assetProps },
      type: 'merchantTransaction',
    });

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
      toTransactionDetails={onPressTransaction}
    />
  );
};
