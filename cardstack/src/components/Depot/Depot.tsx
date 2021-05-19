import React from 'react';
import { FlatList } from 'react-native';
import CoinIcon from 'react-coin-icon';

import { Container, Icon, Text, Touchable } from '@cardstack/components';

export const DEPOT_HEIGHT = 150;

interface Token {
  balance: {
    amount: string;
    display: string;
  };
  native: {
    amount: string;
    display: string;
  };
  token: {
    symbol: string;
    name: string;
  };
}
interface DepotProps {
  address: string;
  /** unique identifier, displayed in top right corner of card */
  onPress: () => void;
  /** balance in xDai */
  tokens: Array<Token>;
}

/**
 * A invetory card component
 */
export const Depot = ({ address, tokens, onPress }: DepotProps) => {
  return (
    <Container width="100%" paddingHorizontal={4}>
      <Touchable width="100%" testID="inventory-card">
        <Container
          backgroundColor="white"
          borderRadius={10}
          overflow="hidden"
          borderColor="buttonPrimaryBorder"
          width="100%"
        >
          <Top address={address} onPress={onPress} />
          <Bottom tokens={tokens} />
        </Container>
      </Touchable>
    </Container>
  );
};

const Top = ({
  address,
  onPress,
}: {
  address: string;
  onPress: () => void;
}) => (
  <Container width="100%">
    <Container
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      backgroundColor="black"
      paddingVertical={4}
      paddingHorizontal={5}
    >
      <Container flexDirection="row" alignItems="center">
        <Text fontFamily="RobotoMono-Regular" color="white">
          {address.slice(0, 6)}
        </Text>
        <Text
          fontFamily="RobotoMono-Regular"
          color="white"
          letterSpacing={1.35}
        >
          ...
        </Text>
        <Text fontFamily="RobotoMono-Regular" color="white">
          {address.slice(-4)}
        </Text>
      </Container>
      <Touchable flexDirection="row" alignItems="center" onPress={onPress}>
        <Text color="white" weight="extraBold" size="small" marginRight={3}>
          View
        </Text>
        <Icon name="chevron-right" color="white" iconSize="medium" />
      </Touchable>
    </Container>
  </Container>
);

const renderItem = ({ item }: { item: Token }) => {
  return (
    <Container
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      minHeight={75}
    >
      <Container flexDirection="row" alignItems="center">
        <CoinIcon size={30} {...item.token} />
        <Text size="body" marginLeft={2}>
          {item.token.name}
        </Text>
      </Container>
      <Container alignItems="flex-end">
        <Text size="medium" weight="extraBold">
          {`${item.balance.display}`}
        </Text>
      </Container>
    </Container>
  );
};

const Bottom = ({ tokens }: { tokens: Array<Token> }) => {
  return (
    <Container paddingHorizontal={6}>
      <FlatList data={tokens} renderItem={renderItem} />
    </Container>
  );
};
