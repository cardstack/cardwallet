import React from 'react';
import { NetworkBadge } from '../NetworkBadge';
import {
  getDisplayDataByStatus,
  statusToDisplayData,
} from './statusToDisplayData';
import {
  CoinIcon,
  Container,
  ContainerProps,
  HorizontalDivider,
  Icon,
  Text,
  Touchable,
} from '@cardstack/components';
import { TransactionItem } from '@cardstack/types';

export interface TransactionCoinRowProps extends ContainerProps {
  item: TransactionItem;
}

/**
 * A component for displaying a transaction item
 */
export const TransactionCoinRow = ({
  item,
  ...props
}: TransactionCoinRowProps) => {
  if (!item) {
    return null;
  }

  return (
    <Touchable
      width="100%"
      alignItems="center"
      testID="transaction-coin-row"
      paddingHorizontal={5}
      {...props}
    >
      <Container
        width="100%"
        padding={4}
        backgroundColor="white"
        borderRadius={10}
        borderColor="borderGray"
        borderWidth={1}
        margin={2}
      >
        <NetworkBadge marginBottom={4} />
        {item.swappedFor && (
          <>
            <TransactionRow {...item.swappedFor} />
            <HorizontalDivider />
          </>
        )}
        <TransactionRow {...item} />
      </Container>
    </Touchable>
  );
};

const TransactionRow = (item: TransactionItem) => (
  <Container
    alignItems="center"
    justifyContent="space-between"
    flexDirection="row"
    width="100%"
  >
    <Left {...item} />
    <Right {...item} />
  </Container>
);

const Left = (item: TransactionItem) => {
  const displayData = getDisplayDataByStatus(item.status);

  return (
    <Container flexDirection="row" alignItems="center">
      <CoinIcon size={40} {...item} />
      <Container flexDirection="row" alignItems="center" marginLeft={2}>
        <Icon
          color="backgroundBlue"
          {...displayData.iconProps}
          marginRight={1}
        />
        <Text fontSize={13} color="blueText" weight="bold">
          {item.title}
        </Text>
      </Container>
    </Container>
  );
};

const Right = (item: TransactionItem) => {
  const displayData = getDisplayDataByStatus(item.status);

  return (
    <Container>
      <Container alignItems="flex-end">
        <Text weight="extraBold">{`${displayData.transactionSymbol} ${item.balance.display}`}</Text>
        <Text variant="subText">{`${item.native.display}`}</Text>
      </Container>
    </Container>
  );
};
