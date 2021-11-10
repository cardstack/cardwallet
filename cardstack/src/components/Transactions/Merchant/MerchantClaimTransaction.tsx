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
import { ClaimStatuses, getClaimProps } from '@cardstack/utils';

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
      navigate(Routes.EXPANDED_ASSET_SHEET_DRILL, {
        asset: {
          ...assetProps,
          claimStatus: item.claimStatus || ClaimStatuses.DEPOSITED,
        },
        type: 'merchantTransaction',
      }),
    [item.claimStatus, navigate]
  );

  const claimProps = getClaimProps(item.claimStatus);

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
            rightText={merchantInfoDID?.name || 'Business'}
            small
          />
        ) : null
      }
      primaryText={`${claimProps.sign} ${item.balance.display}`}
      statusIconName={claimProps.icon}
      statusText={claimProps.text}
      subText={item.native.display}
      transactionHash={item.transactionHash}
      onPressTransaction={onPressTransaction}
    />
  );
};
