import React from 'react';

import { CoinIcon, Text, Container, Icon } from '@cardstack/components';
import { PrepaidCardCreatedTransactionType } from '@cardstack/types';
import { getAddressPreview } from '@cardstack/utils';

import {
  TransactionBase,
  TransactionBaseCustomizationProps,
} from '../TransactionBase';

import { PrepaidCardTransactionHeader } from './PrepaidCardTransactionHeader';

interface PrepaidCardCreatedTransactionProps
  extends TransactionBaseCustomizationProps {
  item: PrepaidCardCreatedTransactionType;
}

export const PrepaidCardCreatedTransaction = ({
  item,
  ...props
}: PrepaidCardCreatedTransactionProps) => {
  return (
    <TransactionBase
      {...props}
      CoinIcon={<Icon name="spend" />}
      Header={
        <PrepaidCardTransactionHeader
          address={item.address}
          cardCustomization={item.cardCustomization}
        />
      }
      statusIconName="git-commit"
      statusText="Loaded"
      primaryText={`+ ${item.nativeBalanceDisplay}`}
      Footer={
        <Container
          paddingHorizontal={5}
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
      transactionHash={item.transactionHash}
    />
  );
};
