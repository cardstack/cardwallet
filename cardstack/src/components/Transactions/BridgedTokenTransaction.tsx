import React from 'react';
import { NetworkBadge } from '../NetworkBadge';
import {
  CoinIcon,
  Container,
  ContainerProps,
  Icon,
  SafeHeader,
  Text,
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
    <Container width="100%" paddingHorizontal={4} {...props} marginVertical={2}>
      <Touchable width="100%" testID="inventory-card">
        <Container
          backgroundColor="white"
          borderRadius={10}
          overflow="hidden"
          borderColor="buttonPrimaryBorder"
          width="100%"
        >
          <SafeHeader address={item.to} rightText="DEPOT" />
          <Bottom {...item} />
        </Container>
      </Touchable>
    </Container>
  );
};

const Bottom = (token: BridgedToken) => {
  return (
    <Container paddingHorizontal={6} paddingVertical={4}>
      <Container
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Container
          alignItems="center"
          flexDirection="row"
          justifyContent="space-between"
          width="100%"
        >
          <Container flexDirection="row" alignItems="center">
            {/* NEED ERC-20 TOKEN DATA */}
            <CoinIcon address={token.token} symbol="DAI" />
            <Container marginLeft={4} flexDirection="row">
              <Icon name="arrow-down" size={16} color="blueText" />
              <Text variant="subText" weight="bold" marginLeft={1}>
                Received
              </Text>
            </Container>
          </Container>
          <Container
            flexDirection="column"
            marginLeft={3}
            alignItems="flex-end"
          >
            <Text weight="extraBold">{`+ ${token.balance.display}`}</Text>
            <Text variant="subText">{token.native.display}</Text>
          </Container>
        </Container>
      </Container>
    </Container>
  );
};
