import React, { useCallback } from 'react';

import { useNavigation } from '@react-navigation/core';
import { SafeHeader } from '../../SafeHeader';
import {
  TransactionBase,
  TransactionBaseCustomizationProps,
  TransactionBaseProps,
} from '../TransactionBase';
import { MerchantDepositType } from '@cardstack/types';
import { getAddressPreview } from '@cardstack/utils';
import { CoinIcon } from '@cardstack/components';
import Routes from '@rainbow-me/routes';
import { useMerchantInfoFromDID } from '@cardstack/hooks/merchant/useMerchantInfoFromDID';

export interface MerchantDepositTransactionProps
  extends TransactionBaseCustomizationProps {
  item: MerchantDepositType;
}

export const MerchantDepositTransaction = ({
  item,
  ...props
}: MerchantDepositTransactionProps) => {
  const { merchantInfoDID } = useMerchantInfoFromDID(item.infoDid);
  const { navigate } = useNavigation();

  const onPressTransaction = useCallback(
    (assetProps: TransactionBaseProps) =>
      navigate(Routes.EXPANDED_ASSET_SHEET_DRILL, {
        asset: {
          ...assetProps,
          claimStatus: 'Deposit',
        },
        type: 'merchantTransaction',
      }),
    [navigate]
  );

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
      statusIconName="arrow-down"
      statusText={`Deposited into \nAccount`}
      subText={item.native.display}
      transactionHash={item.transactionHash}
      onPressTransaction={onPressTransaction}
      recipientName={merchantInfoDID?.name || getAddressPreview(item.address)}
    />
  );
};
