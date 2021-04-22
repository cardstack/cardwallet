import React from 'react';
import { FlatList } from 'react-native';

import { numberWithCommas } from '@cardstack/utils';
import { Container, Icon, Text, Touchable } from '@cardstack/components';

interface ItemData {
  title: string;
  length: number | string;
  totalValue?: string | number;
  totalValueText?: string;
}

interface InventoryProps {
  title: string;
  /** unique identifier, displayed in top right corner of card */
  onPress: () => void;
  /** balance in xDai */
  items: Array<ItemData>;
}

/**
 * A invetory card component
 */
export const Inventory = ({ title, items, onPress }: InventoryProps) => {
  return (
    <Container width="100%">
      <Touchable width="100%" testID="inventory-card">
        <Container
          backgroundColor="white"
          borderRadius={10}
          overflow="hidden"
          borderColor="buttonPrimaryBorder"
          width="100%"
        >
          <Top title={title} onPress={onPress} />
          <Bottom items={items} />
        </Container>
      </Touchable>
    </Container>
  );
};

const Top = ({ title, onPress }: { title: string; onPress: () => void }) => (
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
        <Icon name="inventory" color="white" marginRight={3} />
        <Text size="small" weight="extraBold" color="white">
          {title.toUpperCase()}
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

const renderItem = ({ item }: { item: ItemData }) => {
  return (
    <Container
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      borderBottomColor="underlineGray"
      borderBottomWidth={2}
      minHeight={75}
    >
      <Text size="medium">
        {item.title}{' '}
        <Text size="medium" color="settingsGray" weight="bold">
          {item.length}
        </Text>
      </Text>
      {item.totalValue && (
        <Container alignItems="flex-end">
          <Text size="small" color="backgroundBlue">
            {item.totalValueText}
          </Text>
          <Text size="medium" weight="extraBold">
            {`§${numberWithCommas(item.totalValue.toString())}`}
          </Text>
        </Container>
      )}
    </Container>
  );
};

const Bottom = ({ items }: { items: Array<ItemData> }) => {
  return (
    <Container paddingHorizontal={6}>
      <FlatList data={items} renderItem={renderItem} />
    </Container>
  );
};
