import React from 'react';
import { NetworkBadge } from '../NetworkBadge';
import {
  Container,
  ContainerProps,
  SafeHeader,
  Touchable,
} from '@cardstack/components';
import { BridgedToken } from '@cardstack/types';

export interface BridgedTokenTransactionProps extends ContainerProps {
  item: BridgedToken;
}

/**
 * A component for displaying a transaction item
 */
export const BridgedTokenTransaction = ({
  item,
  ...props
}: BridgedTokenTransactionProps) => {
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
        <TransactionRow {...item} />
      </Container>
    </Touchable>
  );
};

const TransactionRow = (item: BridgedToken) => (
  <Container
    alignItems="center"
    justifyContent="space-between"
    flexDirection="row"
    width="100%"
  >
    <SafeHeader address={item.to} />
  </Container>
);
