import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/core';
import { Icon } from '../../Icon';
import {
  TransactionBase,
  TransactionBaseCustomizationProps,
  TransactionBaseProps,
} from '../TransactionBase';
import { MerchantEarnedSpendAndRevenueTransactionType } from '@cardstack/types';
import { CoinIcon, Container, SafeHeader, Text } from '@cardstack/components';
import { useMerchantInfoFromDID } from '@cardstack/hooks/merchant/useMerchantInfoFromDID';
import Routes from '@rainbow-me/routes';

export interface MerchantEarnSpendAndRevenueTransactionProps
  extends TransactionBaseCustomizationProps {
  item: MerchantEarnedSpendAndRevenueTransactionType;
}

interface MerchantEarnedSpendAndRevenueTransactionFooter {
  token: { address: string; symbol?: string | null };
  netEarnedDisplayValue: string;
}

export const MerchantEarnedSpendAndRevenueTransactionFooter = ({
  token,
  netEarnedDisplayValue,
}: MerchantEarnedSpendAndRevenueTransactionFooter) => (
  <Container
    paddingHorizontal={5}
    flexDirection="row"
    justifyContent="space-between"
  >
    <Container maxWidth={100}>
      <Text variant="subText" marginBottom={1}>
        Added to revenue pool
      </Text>
    </Container>
    <Container flexDirection="row" alignItems="center">
      <Text size="xs" weight="extraBold" marginRight={2}>
        {`+ ${netEarnedDisplayValue}`}
      </Text>
      <CoinIcon address={token.address} symbol={token.symbol} size={20} />
    </Container>
  </Container>
);

export const MerchantEarnedSpendAndRevenueTransaction = ({
  item,
  ...props
}: MerchantEarnSpendAndRevenueTransactionProps) => {
  const { merchantInfoDID } = useMerchantInfoFromDID(item.infoDid);
  const { navigate } = useNavigation();

  const onPressTransaction = useCallback(
    (transaction: TransactionBaseProps) =>
      navigate(Routes.PAYMENT_RECEIVED_SHEET, {
        transaction: { ...transaction, ...item },
      }),
    [item, navigate]
  );

  return (
    <TransactionBase
      {...props}
      CoinIcon={<Icon name="spend" />}
      Header={
        <SafeHeader
          address={item.address}
          backgroundColor={merchantInfoDID?.color}
          textColor={merchantInfoDID?.textColor}
          rightText={merchantInfoDID?.name || 'Business'}
          small
        />
      }
      Footer={
        <MerchantEarnedSpendAndRevenueTransactionFooter
          token={item.token}
          netEarnedDisplayValue={item.netEarned.display}
        />
      }
      primaryText={`+ ${item.nativeBalanceDisplay}`}
      statusIconName="arrow-down"
      statusText="Received"
      transactionHash={item.transactionHash}
      onPressTransaction={onPressTransaction}
    />
  );
};
