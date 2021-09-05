import React from 'react';

import { useNavigation } from '@react-navigation/core';
import {
  TransactionBase,
  TransactionBaseCustomizationProps,
} from './TransactionBase';
import { CoinIcon } from '@cardstack/components';
import { MerchantEarnedRevenueTransactionType } from '@cardstack/types';
import Routes from '@rainbow-me/routes';

export interface MerchantEarnRevenueTransactionProps
  extends TransactionBaseCustomizationProps {
  item: MerchantEarnedRevenueTransactionType;
}

export const MerchantEarnedRevenueTransaction = ({
  item,
  ...props
}: MerchantEarnRevenueTransactionProps) => {
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
      primaryText={`+ ${item.balance.display}`}
      statusIconName="arrow-down"
      statusText="Earned"
      subText={item.native.display}
      transactionHash={item.transactionHash}
      toTransactionDetails={onPressTransaction}
    />
  );
};
