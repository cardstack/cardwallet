import React, { useCallback } from 'react';

import { useNavigation } from '@react-navigation/core';
import { SafeHeader } from '../../SafeHeader';
import {
  TransactionBase,
  TransactionBaseCustomizationProps,
  TransactionBaseProps,
} from '../TransactionBase';
import { MerchantClaimType } from '@cardstack/types';
import { CoinIcon } from '@cardstack/components';
import Routes from '@rainbow-me/routes';
import { useMerchantInfoFromDID } from '@cardstack/hooks/merchant/useMerchantInfoFromDID';

export interface MerchantClaimTransactionProps
  extends TransactionBaseCustomizationProps {
  item: MerchantClaimType;
}

const CLAIMED_TEXT = `Claimed from \nAvailable Revenue`;
const DEPOSITED_TEXT = `Deposited into \nAccount`;

export const MerchantClaimTransaction = ({
  item,
  ...props
}: MerchantClaimTransactionProps) => {
  const { merchantInfoDID } = useMerchantInfoFromDID(item.infoDid);
  const { navigate } = useNavigation();

  const onPressTransaction = useCallback(
    (assetProps: TransactionBaseProps) =>
      navigate(Routes.EXPANDED_ASSET_SHEET_DRILL, {
        asset: { ...assetProps },
        type: 'merchantTransaction',
      }),
    [navigate]
  );

  return (
    <TransactionBase
      {...props}
      CoinIcon={
        <CoinIcon address={item.token.address} symbol={item.token.symbol} />
      }
      Header={
        !item.hideSafeHeader ? (
          <SafeHeader
            address={item.address}
            backgroundColor={merchantInfoDID?.color}
            textColor={merchantInfoDID?.textColor}
            rightText={merchantInfoDID?.name || 'Merchant'}
            small
          />
        ) : null
      }
      primaryText={`${props.isClaimedFromAvailableRevenue ? '-' : '+'} ${
        item.balance.display
      }`}
      statusIconName={
        props.isClaimedFromAvailableRevenue ? 'arrow-up' : 'arrow-down'
      }
      statusText={
        props.isClaimedFromAvailableRevenue ? CLAIMED_TEXT : DEPOSITED_TEXT
      }
      subText={item.native.display}
      transactionHash={item.transactionHash}
      onPressTransaction={onPressTransaction}
    />
  );
};
