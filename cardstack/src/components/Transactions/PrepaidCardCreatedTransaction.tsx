import React from 'react';
import { PrepaidCardTransaction } from './PrepaidCardTransaction';
import { PrepaidCardCreatedTransactionType } from '@cardstack/types';
import { getAddressPreview } from '@cardstack/utils';
import { CoinIcon, Text, Container } from '@cardstack/components';

export const PrepaidCardCreatedTransaction = ({
  item,
}: {
  item: PrepaidCardCreatedTransactionType;
}) => {
  return (
    <PrepaidCardTransaction
      {...item}
      iconName="arrow-down"
      status="Loaded"
      operator="+"
      primaryText={item.spendBalanceDisplay}
      subText={item.nativeBalanceDisplay}
      Footer={
        <Container
          paddingHorizontal={5}
          paddingBottom={5}
          flexDirection="row"
          justifyContent="space-between"
        >
          <Container>
            <Text variant="subText" marginBottom={1}>
              Funded by Depot
            </Text>
            <Text size="xs" fontFamily="RobotoMono-Regular">
              {getAddressPreview(item.createdFromAddress)}
            </Text>
          </Container>
          <Container flexDirection="row" alignItems="center">
            <Text size="xs" weight="extraBold" marginRight={2}>
              {`- ${item.issuingToken.balance.display}`}
            </Text>
            <CoinIcon
              address={item.issuingToken.address}
              symbol={item.issuingToken.symbol}
              size={20}
            />
          </Container>
        </Container>
      }
    />
  );
};
