import React from 'react';
import { FlatList } from 'react-native';
import CoinIcon from 'react-coin-icon';

import { CoinItem } from '../../types';
import { TruncatedAddress } from '../../../../src/components/text';
import { Container, Icon, Text, Touchable } from '@cardstack/components';

interface InventoryProps {
  address: string;
  /** unique identifier, displayed in top right corner of card */
  onPress: () => void;
  /** balance in xDai */
  tokens: Array<CoinItem>;
}

/**
 * A invetory card component
 */
export const Inventory = ({ address, tokens, onPress }: InventoryProps) => {
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
        <TruncatedAddress
          address={address}
          color="white"
          firstSectionLength={6}
          fontSize={14}
          marginTop={1}
          truncationLength={4}
        />
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

const renderItem = ({ item }: { item: CoinItem }) => {
  return (
    <Container
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      borderBottomColor="underlineGray"
      borderBottomWidth={2}
      minHeight={75}
    >
      <CoinIcon size={30} {...item} />
      <Text size="medium">{item.symbol} </Text>
      <Container alignItems="flex-end">
        <Text size="small" color="backgroundBlue">
          {item.native.display}
        </Text>
        <Text size="medium" weight="extraBold">
          {`§${item.balance.display}`}
        </Text>
      </Container>
    </Container>
  );
};

const Bottom = ({ tokens }: { tokens: Array<CoinItem> }) => {
  return (
    <Container paddingHorizontal={6}>
      <FlatList data={tokens} renderItem={renderItem} />
    </Container>
  );
};
