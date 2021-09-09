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

export const MerchantClaimTransaction = ({
  item,
  ...props
}: MerchantClaimTransactionProps) => {
  const { merchantInfoDID } = useMerchantInfoFromDID(item.infoDid);
  const { navigate } = useNavigation();

  const onPressTransaction = useCallback(
    (assetProps: TransactionBaseProps) =>
      navigate(Routes.EXPANDED_ASSET_SHEET, {
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
            rightText={merchantInfoDID?.name || 'Merchant'}
            small
          />
        ) : null
      }
      primaryText={`- ${item.balance.display}`}
      statusIconName="arrow-up"
      statusText="Claimed"
      subText={item.native.display}
      transactionHash={item.transactionHash}
      onPressTransaction={onPressTransaction}
    />
  );
};
