import React from 'react';
import { Icon } from '../../Icon';
import {
  TransactionBase,
  TransactionBaseCustomizationProps,
} from '../TransactionBase';
import { MerchantEarnedSpendAndRevenueTransactionType } from '@cardstack/types';
import { CoinIcon, Container, SafeHeader, Text } from '@cardstack/components';

import { useMerchantInfoFromDID } from '@cardstack/hooks/merchant/useMerchantInfoFromDID';

export interface MerchantEarnSpendAndRevenueTransactionProps
  extends TransactionBaseCustomizationProps {
  item: MerchantEarnedSpendAndRevenueTransactionType;
}

export const MerchantEarnedSpendAndRevenueTransaction = ({
  item,
  ...props
}: MerchantEarnSpendAndRevenueTransactionProps) => {
  const { merchantInfoDID } = useMerchantInfoFromDID(item.infoDid);

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
              {`+ ${item.balance.display}`}
            </Text>
            <CoinIcon
              address={item.token.address}
              symbol={item.token.symbol}
              size={20}
            />
          </Container>
        </Container>
      }
      primaryText={`+ ${item.spendBalanceDisplay}`}
      statusIconName="arrow-down"
      statusText="Earned"
      subText={item.nativeBalanceDisplay}
      transactionHash={item.transactionHash}
    />
  );
};
